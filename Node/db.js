const { Document } = require('./models/doc.js');
const { Version } = require('./models/version.js');
const { saveDocumentOnLeave } = require('./CRDTs/DocMap.js');

const saveDocument = async (req, res) => {
  const { docId } = req.body;
  const document = await Document.findOne({ where: { id: docId } });

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  const result = await saveDocumentOnLeave(docId);
  return res.status(result.status).json({ message: result.message });
};

const rollbackDocument = async (req, res) => {
  const { docId, versionId } = req.body;
  const { io } = req;

  const room = io?.sockets.adapter.rooms.get(docId.toString());
  const roomSize = room ? room.size : 0;

  if (roomSize !== 0) {
    return res.status(400).json({ message: 'Document is currently being edited' });
  }

  const document = await Document.findOne({ where: { id: docId } });

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  const version = await Version.findOne({ where: { id: versionId } });

  if (!version) {
    return res.status(404).json({ message: 'Version not found' });
  }

  await document.update({ content: version.content });

  res.status(200).json(document);
}

module.exports = { saveDocument, rollbackDocument };