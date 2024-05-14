const { v4: uuidv4 } = require('uuid');
const { loadDocument, saveDocumentOnLeave } = require('./CRDTs/DocMap.js');
const { docMap } = require('./CRDTs/DocMap.js');

const setupEvents = (io, socket) => {
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('join-document', async (docID) => {
    console.log(`Joining document ${docID}`);
    socket.join(docID);
    let doc = null;
    try{
      doc = await loadDocument(docID);
    } catch(e) {
      socket.emit('error', e.message);
      return;
    }
    const loadedDocument = JSON.stringify(doc.doc);
    socket.emit('document-joined', {siteID: uuidv4(), loadDocument: loadedDocument });
  });

  socket.on('send-changes', (docID, crdt) => {
    console.log(`Sending changes to document ${docID}`, crdt);
    const newCRDT = JSON.parse(crdt);
    if (!socket.rooms.has(docID)) {
      socket.emit('error', 'Socket is not subscribed to room')
      return;
    }
    const char = docMap[docID].doc.find((oldCRDT) => newCRDT.siteID == oldCRDT.siteID && newCRDT.siteCounter == oldCRDT.siteCounter);
    if (newCRDT.tombstone) {
      docMap[docID].handleRemoteDelete(newCRDT);
    } else if (!char) {
      docMap[docID].handleRemoteInsert(newCRDT);
    } else {
      docMap[docID].handleRemoteAttribute(newCRDT);
    }
    
    socket.to(docID).emit('receive-changes', crdt);
  });
  
  socket.on('leave-document', async (docID, siteID) => {
    console.log(`Leaving document ${docID}`);
    socket.leave(docID);
    const room = io.sockets.adapter.rooms.get(docID);
    const roomSize = room ? room.size : 0;
    console.log(roomSize);
    if (roomSize === 0) {
      await saveDocumentOnLeave(docID);
      delete docMap[docID];
    }
    socket.to(docID).emit('user-left', siteID);
  });

  socket.on('send-cursor', (docId, cursor, range) => {
    console.log(`Sending cursor to document ${docId} from site ${cursor} at range ${range}`);
    socket.to(docId).emit('receive-cursor', cursor, range);
  });
}

module.exports = { setupEvents };