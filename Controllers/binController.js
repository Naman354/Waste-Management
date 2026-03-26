const Bin = require('../models/Bin');

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

module.exports = { getBins, updateBin };
