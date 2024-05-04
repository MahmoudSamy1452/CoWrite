const { Document } = require('../models/doc.js');
const { Doc } = require('./Doc.js');

const docMap = {};

const loadDocument = async (docId) => {
    if (!docMap[docId]) {
        const document = await Document.findOne({ where: { id: docId } });
        docMap[docId] = new Doc(document.content);
    }
    console.log(docMap);
}

module.exports = {
    docMap,
    loadDocument
}