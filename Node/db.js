const { docMap } = require('./CRDTs/DocMap.js');
const { Document } = require('./models/doc.js');
const { Version } = require('./models/version.js');

const saveDocument = async (req, res) => {
  const { docId } = req.body;
  const document = await Document.findOne({ where: { id: docId } });

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  await document.update({ content: JSON.stringify(docMap[docId].doc) });

  const versions = await Version.findAll({ where: { document_id: docId } });
  const versionNumber = versions.length + 1;

  await Version.create({
    document_id: docId,
    content: JSON.stringify(docMap[docId].doc),
    version_number: versionNumber
  });

  res.status(200).json(document);
};

module.exports = { saveDocument };