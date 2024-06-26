const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const docRouter = require('./router.js');
const { Sequelize } = require('sequelize');
const { Buffer } = require('buffer');
const { initializeModels } = require('./models/initialization.js');
const { setupEvents } = require('./socket.js');
const router = express.Router();

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

initializeModels(seq);

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, { 
  cors: { origin: process.env.CORS_ORIGIN }, 
  methods: ['GET', 'POST'] 
});

router.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

app.use((req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  const token = authHeader.split(' ')[1];
  const secret = Buffer.from(process.env.JWT_SECRET, 'base64');
  jwt.verify(token, secret, { algorithms: ['HS512'] }, (err, user) => {
    if (err) {
      res.sendStatus(403);
    } else {
      req.user = user;
      req.io = io;
      next();
    }
  });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log(token);
  if (token) {
    const secret = Buffer.from(process.env.JWT_SECRET, 'base64');
    jwt.verify(token, secret, { algorithms: ['HS512'] }, (err, user) => {
      if (err) {
        next(new Error('Authentication error'));
      } else {
        socket.user = user;
        next();
      }
    });
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  setupEvents(io, socket);
});

app.use(docRouter)

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Listening on port', PORT));
