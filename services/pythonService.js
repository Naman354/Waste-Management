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

    // Handle both diskStorage and memoryStorage
    if (imageFile.path) {
      form.append('file', fs.createReadStream(imageFile.path), imageFile.originalname);
    } else {
      form.append('file', imageFile.buffer, imageFile.originalname);
    }

    const response = await axios.post(
      `${baseUrl}/predict`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 5000
      }
    );

    return response.data;

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