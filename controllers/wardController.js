const Ward = require('../models/Ward.js');

const createWard = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (id === undefined || !name) {
      return res.status(400).json({ error: 'Missing required ward fields' });
    }

    const existingWard = await Ward.findOne({ id: Number(id) });
    if (existingWard) {
      return res.status(409).json({ error: 'Ward with this id already exists' });
    }

    const ward = new Ward({
      id: Number(id),
      name,
    });

    await ward.save();

    res.status(201).json({ success: true, ward });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWards = async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createWard, getWards };
