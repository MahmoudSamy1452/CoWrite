const { docMap } = require('./CRDTs/DocMap.js');
const { Document } = require('./models/doc.js');

const saveDocument = async (req, res) => {
  const { docId } = req.body;
  const document = await Document.findOne({ where: { id: docId } });

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  await document.update({ content: JSON.stringify(docMap[docId].doc) });
  res.status(200).json(document);
};

module.exports = { saveDocument };