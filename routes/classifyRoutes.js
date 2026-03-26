const express = require('express');
const router = express.Router();
const { classifyImage } = require('../controllers/classifyController');
const upload = require('../utils/upload');

// POST /classify
router.post('/', upload.single('image'), classifyImage);

module.exports = router;
