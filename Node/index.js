const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { initializeModels } = require('./models/doc.js');
const { saveDocument } = require('./db.js');
const { loadDocument, saveDocumentOnLeave } = require('./CRDTs/DocMap.js');
const { docMap } = require('./CRDTs/DocMap.js');

dotenv.config();
const seq = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  }
);

(async () => {
  try {
    await seq.authenticate().then(() => { initializeModels(seq) });
    console.log('Connection to MySQL database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process on connection failure
  }
})();

const app = express();
const corsOptions = {
  origin: 'https://cowrite-frontend.vercel.app/',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' }, methods: ['GET', 'POST'] });

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('join-document', async (docID) => {
    console.log(`Joining document ${docID}`);
    socket.join(docID);
    const doc = await loadDocument(docID);
    const loadedDocument = JSON.stringify(doc.doc);
    socket.emit('document-joined', {siteID: uuidv4(), loadDocument: loadedDocument });
  });
  socket.on('send-changes', (docID, crdt) => {
    console.log(`Sending changes to document ${docID}`);
    const newCRDT = JSON.parse(crdt);
    const char = docMap[docID].doc.find((oldCRDT) => newCRDT.siteID == oldCRDT.siteID && newCRDT.siteCounter == oldCRDT.siteCounter);
    console.log(newCRDT)
    console.log(char)
    if (newCRDT.tombstone) {
      docMap[docID].handleRemoteDelete(newCRDT);
    } else if (!char) {
      console.log(newCRDT)
      docMap[docID].handleRemoteInsert(newCRDT);
    } else {
      docMap[docID].handleRemoteAttribute(newCRDT);
    }
    console.log(docMap[docID])
    socket.to(docID).emit('receive-changes', crdt);
  });
  socket.on('leave-document', async (docID) => {
    console.log(`Leaving document ${docID}`);
    socket.leave(docID);
    const room = io.sockets.adapter.rooms.get(docID);
    const roomSize = room ? room.size : 0;
    console.log(roomSize);
    if (roomSize === 0) {
      await saveDocumentOnLeave(docID);
      delete docMap[docID];
    }
  });
});
const router = express.Router();
router.put('/save', saveDocument);
app.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Listening on port', PORT));

module.exports = { seq };