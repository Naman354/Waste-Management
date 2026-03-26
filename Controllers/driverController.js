const { setDriverLocation, getDrivers: getDriversFromStore } = require('../memory/driverStore');

const updateDriverLocation = (req, res) => {
  try {
    const { driverId, wardId, lat, lng } = req.body;
    setDriverLocation(driverId, wardId, lat, lng);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDrivers = (req, res) => {
  try {
    const drivers = getDriversFromStore();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateDriverLocation, getDrivers };
