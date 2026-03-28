const Complaint = require('../models/Complaint.js');

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getComplaintsByWard = async (req, res) => {
  try {
    const wardId = Number(req.params.wardId);

    if (Number.isNaN(wardId)) {
      return res.status(400).json({ error: 'Invalid ward id' });
    }

    const complaints = await Complaint.find({ wardId }).sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

module.exports = { getAllComplaints, getComplaintsByWard, createComplaint };
