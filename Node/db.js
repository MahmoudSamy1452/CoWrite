const { Document } = require('./models/doc.js');
const { Version } = require('./models/version.js');
const { io } = require('./index.js');
const { saveDocumentOnLeave } = require('./CRDTs/DocMap.js');

const saveDocument = async (req, res) => {
  const { docId } = req.body;
  const document = await Document.findOne({ where: { id: docId } });

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  // await document.update({ content: JSON.stringify(docMap[docId].doc) });

  // const versions = await Version.findAll({ where: { document_id: docId } });
  // const versionNumber = versions.length + 1;

  // await Version.create({
  //   document_id: docId,
  //   content: JSON.stringify(docMap[docId].doc),
  //   version_number: versionNumber
  // });

  await saveDocumentOnLeave(docId);

  res.status(200).json(document);
};

const rollbackDocument = async (req, res) => {
  const { docId, versionId } = req.body;

  console.log(io)
  const room = io?.sockets.adapter.rooms.get(docId);
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