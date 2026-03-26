const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const { wardId, lat, lng, message, imageUrl } = req.body;

    const complaint = new Complaint({ wardId, lat, lng, message, imageUrl });
    await complaint.save();

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createComplaint };
