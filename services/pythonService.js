const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const classifyImage = async (imageFile) => {
  try {
    const baseUrl = process.env.PYTHON_URL?.replace(/\/+$/, '');

    if (!baseUrl) {
      throw new Error('PYTHON_URL is not configured');
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(imageFile.path), imageFile.originalname);

    const response = await axios.post(
      `${baseUrl}/predict`,
      form,
      { headers: form.getHeaders() }
    );

    return {
      status: response.data.status,
      detected: response.data.detected,
      message: response.data.message,
      tip: response.data.tip,
    };
  } catch (err) {
    console.error('ML ERROR FULL:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    return {
      status: 'unknown',
      detected: false,
      message: 'Failed to classify the uploaded image.',
      tip: 'Please try again after the ML service becomes available.',
    };
  }
};

module.exports = { classifyImage };
