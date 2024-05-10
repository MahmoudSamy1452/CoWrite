const { initializeDocumentModel } = require('./doc.js')
const { initializeVersionModel } = require('./version.js')

const initializeModels = (seq) => {
    initializeDocumentModel(seq)
    initializeVersionModel(seq)
}

module.exports = { initializeModels }