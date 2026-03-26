const axios = require('axios');

const optimizeRoute = async (driverLocation, bins) => {
  try {
    const response = await axios.post(`${process.env.PYTHON_API_URL}/optimize`, {
      driverLocation,
      bins,
    });

    return response.data.bins;
  } catch (err) {
    return bins;
  }
};

module.exports = { optimizeRoute };
