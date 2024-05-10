const { Document } = require('../models/doc.js');
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

    console.log(docMap)
    await document.update({ content: JSON.stringify(docMap[docId].doc) });
}

module.exports = {
    docMap,
    loadDocument,
    saveDocumentOnLeave
}