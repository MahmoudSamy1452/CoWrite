const { Document } = require('../models/doc.js');
const { Version } = require('../models/version.js');
const { Doc } = require('./Doc.js');

const docMap = {};

const loadDocument = async (docId) => {
    if (!docMap[docId]) {
        const document = await Document.findOne({ where: { id: docId } });
        if(!document) {
            throw new Error('Document not found');
        }
        docMap[docId] = new Doc(document.content);
    }
    return docMap[docId];
}

const saveDocumentOnLeave = async (docId) => {
    try {
        if (!docMap[docId]) {
            return { status: 500, message: 'Document not found in docMap' };
        }
        const document = await Document.findOne({ where: { id: docId } });

        if (!document) {
            return { status: 400, message: 'Document not found in database' };
        }

        const versions = await Version.findAll({ where: { document_id: docId } });
        const versionNumber = versions.length + 1;

        const lastVersion = versions[versions.length - 1];

        const doc = docMap[docId].doc;
        const filtered = [doc[0], ...doc.slice(1, -1).filter((crdt) => crdt.tombstone === false), doc[doc.length - 1]];
        docMap[docId].doc = filtered;

        if (lastVersion && lastVersion.content === JSON.stringify(docMap[docId].doc)) {
            delete docMap[docId];
            return { status: 200, message: 'No changes detected in document' };
        }

        await document.update({ content: JSON.stringify(docMap[docId].doc) });

        await Version.create({
            document_id: docId,
            content: JSON.stringify(docMap[docId].doc),
            version_number: versionNumber
        });
        
        delete docMap[docId];
        return { status: 200, message: 'Document saved successfully' }
    } catch (e) {
        return { status: 500, message: e.message };
    }
}

module.exports = {
    docMap,
    loadDocument,
    saveDocumentOnLeave
}