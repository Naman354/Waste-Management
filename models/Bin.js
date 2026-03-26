const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  wardId: {
    type: Number,
    required: true,
    immutable: true,
  },
  lat: {
    type: Number,
    required: true,
    immutable: true,
  },
  lng: {
    type: Number,
    required: true,
    immutable: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Empty', 'Filling', 'Full'],
  },
  category: {
    type: String,
    required: true,
    immutable: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bin', binSchema);
