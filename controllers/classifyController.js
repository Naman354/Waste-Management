const { classifyImage: callPython } = require('../services/pythonService.js');

const classifyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'unknown',
        detected: false,
        message: 'No image file uploaded.',
        tip: 'Send the image as form-data with the field name image.',
      });
    }

    const result = await callPython(req.file);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: 'unknown',
      detected: false,
      message: 'Failed to process the uploaded image.',
      tip: 'Please try again after the service becomes available.',
    });
  }
};

module.exports = { classifyImage };
