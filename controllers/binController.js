const Bin = require('../models/Bin.js');
//comment by SHivansh
const createBin = async (req, res) => {
  try {
    const { id, wardId, lat, lng, status, category, lastUpdated } = req.body;
    const allowedStatuses = ['Empty', 'Filling', 'Full'];

    if (
      !id ||
      wardId === undefined ||
      lat === undefined ||
      lng === undefined ||
      !status ||
      !category
    ) {
      return res.status(400).json({ error: 'Missing required bin fields' });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const existingBin = await Bin.findOne({ id });
    if (existingBin) {
      return res.status(409).json({ error: 'Bin with this id already exists' });
    }

    const bin = new Bin({
      id,
      wardId: Number(wardId),
      lat: Number(lat),
      lng: Number(lng),
      status,
      category,
      lastUpdated,
    });

    await bin.save();

    res.status(201).json({ success: true, bin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBins = async (req, res) => {
  try {
    const filter = {};
    if (req.query.ward) {
      filter.wardId = Number(req.query.ward);
    }
    const bins = await Bin.find(filter);
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBin = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Empty', 'Filling', 'Full'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const bin = await Bin.findOneAndUpdate(
      { id: req.params.id },
      { status, lastUpdated: new Date() },
      { new: true }
    );

    if (!bin) return res.status(404).json({ error: 'Bin not found' });

    res.json(bin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createBin, getBins, updateBin };
