const { Document } = require('../models/doc.js');
const { Version } = require('../models/version.js');
const { Doc } = require('./Doc.js');

const docMap = {};

const loadDocument = async (docId) => {
    if (!docMap[docId]) {
        const document = await Document.findOne({ where: { id: docId } });
        if(!document) {
            return null;
        }
        docMap[docId] = new Doc(document.content);
    }
    console.log(docMap)
    return docMap[docId];
}

const saveDocumentOnLeave = async (docId) => {
    if (!docMap[docId]) {
        return;
    }
    const document = await Document.findOne({ where: { id: docId } });

    if (!document) {
        return;
    }

    const versions = await Version.findAll({ where: { document_id: docId } });
    const versionNumber = versions.length + 1;

    const lastVersion = versions[versions.length - 1];

    if (lastVersion && lastVersion.content === JSON.stringify(docMap[docId].doc)) {
        return;
    }

    console.log(docMap)
    await document.update({ content: JSON.stringify(docMap[docId].doc) });

    const version = await Version.create({
        document_id: docId,
        content: JSON.stringify(docMap[docId].doc),
        version_number: versionNumber
    });
}

module.exports = {
    docMap,
    loadDocument,
    saveDocumentOnLeave
}