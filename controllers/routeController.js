const Bin = require('../models/Bin');
const { optimizeRoute } = require('../services/routeService.js');

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
    const binsById = new Map(bins.map((bin) => [String(bin.id), bin]));

    const result = ordered
      .map((bin) => binsById.get(String(bin.id)))
      .filter(Boolean)
      .map((bin) => ({
        id: bin.id,
        wardId: bin.wardId,
        lat: bin.lat,
        lng: bin.lng,
        status: bin.status,
        category: bin.category,
        lastUpdated: bin.lastUpdated,
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDriverRoute };
