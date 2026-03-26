const Bin = require('../models/Bin');
const { optimizeRoute } = require('../services/routeService');

const getDriverRoute = async (req, res) => {
  try {
    const { driverId, ward, lat, lng } = req.query;

    const bins = await Bin.find({ wardId: Number(ward), status: 'Full' });

    if (!bins.length) return res.json([]);

    const driverLocation = {
      driverId,
      wardId: ward,
      lat: Number(lat),
      lng: Number(lng),
    };

    const ordered = await optimizeRoute(driverLocation, bins);

    const result = ordered.map((bin) => ({ id: bin.id, lat: bin.lat, lng: bin.lng }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDriverRoute };
