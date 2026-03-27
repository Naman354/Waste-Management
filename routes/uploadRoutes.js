const express = require('express');
const router = express.Router();
const upload = require('../utils/upload.js');
const { uploadImage } = require('../controllers/uploadController.js');

// POST /upload
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
