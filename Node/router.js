const express = require('express');
const { saveDocument, rollbackDocument } = require('./db.js');

const router = express.Router();

router.put('/save', saveDocument);
router.put('/rollback', rollbackDocument);

module.exports = router;