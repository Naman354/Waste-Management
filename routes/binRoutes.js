const express = require('express');
const router = express.Router();
const { createBin, getBins, updateBin } = require('../controllers/binController.js');

// POST /bins
router.post('/', createBin);

// GET /bins
// GET /bins?ward=
router.get('/', getBins);

// PATCH /bin/:id
router.patch('/:id', updateBin);

module.exports = router;
