const axios = require('axios');

const optimizeRoute = async (driverLocation, bins) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_API_URL}/optimize`,
      { driverLocation, bins }
    );

    if (!response.data || !response.data.bins) {
      return bins;
    }

    return response.data.bins;
  } catch (err) {
    console.error("OR service error:", err.message);
    return bins;
  }
};

module.exports = { optimizeRoute };
