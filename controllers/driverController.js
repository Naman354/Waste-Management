const { setDriverLocation, getDrivers: getDriversFromStore } = require('../memory/driverStore.js');

const normalizeLocationPayload = (payload) => {
  const { driverId, wardId, lat, lng } = payload;

  if (!driverId || wardId === undefined || lat === undefined || lng === undefined) {
    return { error: 'driverId, wardId, lat and lng are required' };
  }

  const normalized = {
    driverId: String(driverId),
    wardId: Number(wardId),
    lat: Number(lat),
    lng: Number(lng),
  };

  if (
    Number.isNaN(normalized.wardId) ||
    Number.isNaN(normalized.lat) ||
    Number.isNaN(normalized.lng)
  ) {
    return { error: 'wardId, lat and lng must be valid numbers' };
  }

  return { value: normalized };
};

const updateDriverLocation = (req, res) => {
  try {
    const result = normalizeLocationPayload(req.body || {});
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const { driverId, wardId, lat, lng } = result.value;
    setDriverLocation(driverId, wardId, lat, lng);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDriverLocationsBulk = (req, res) => {
  try {
    const { locations } = req.body || {};

    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: 'locations must be a non-empty array' });
    }

    const normalizedLocations = [];

    for (const location of locations) {
      const result = normalizeLocationPayload(location || {});
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      normalizedLocations.push(result.value);
    }

    normalizedLocations.forEach(({ driverId, wardId, lat, lng }) => {
      setDriverLocation(driverId, wardId, lat, lng);
    });

    res.json({ success: true, updated: normalizedLocations.length });
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

module.exports = { updateDriverLocation, updateDriverLocationsBulk, getDrivers };
