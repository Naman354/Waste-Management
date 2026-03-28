const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  getComplaintsByWard,
  createComplaint,
} = require('../controllers/complaintController.js');

// GET /complaint
router.get('/', getAllComplaints);

// GET /complaint/ward/:wardId
router.get('/ward/:wardId', getComplaintsByWard);

// POST /complaint
router.post('/', createComplaint);

module.exports = router;
