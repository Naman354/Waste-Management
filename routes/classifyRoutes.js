const express = require('express');
const router = express.Router();
const { classifyImage } = require('../controllers/classifyController.js');
const upload = require('../utils/upload.js');

// POST /classify
router.post('/', upload.single('image'), classifyImage);

module.exports = router;
