const axios = require('axios');
const FormData = require('form-data');

const classifyImage = async (imageFile) => {
  try {
    const form = new FormData();
    form.append('image', imageFile.buffer, imageFile.originalname);

    const response = await axios.post(
      `${process.env.PYTHON_API_URL}/classify`,
      form,
      { headers: form.getHeaders() }
    );

    return { category: response.data.category };
  } catch (err) {
    return { category: 'unknown' };
  }
};

module.exports = { classifyImage };
