const express = require('express');
const router = express.Router();
const { createWard, getWards } = require('../controllers/wardController.js');

// POST /wards
router.post('/', createWard);

// GET /wards
router.get('/', getWards);

module.exports = router;
