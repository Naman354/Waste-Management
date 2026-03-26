const Ward = require('../models/Ward');

const getWards = async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getWards };
