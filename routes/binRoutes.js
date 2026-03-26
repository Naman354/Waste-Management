const express = require('express');
const router = express.Router();
const { getBins, updateBin } = require('../controllers/binController');

// GET /bins
// GET /bins?ward=
router.get('/', getBins);

// PATCH /bin/:id
router.patch('/:id', updateBin);

module.exports = router;
