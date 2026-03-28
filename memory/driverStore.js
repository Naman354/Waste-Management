const driverLocations = {};

const setDriverLocation = (driverId, wardId, lat, lng) => {
  driverLocations[driverId] = { driverId, wardId, lat, lng };
};

const getDriverLocation = (driverId) => {
  return driverLocations[driverId] || null;
};

const getDrivers = () => {
  return Object.values(driverLocations);
};

const clearDriver = (driverId) => {
  delete driverLocations[driverId];
};

module.exports = { setDriverLocation, getDriverLocation, getDrivers, clearDriver };
