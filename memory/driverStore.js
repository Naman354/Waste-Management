const driverLocations = {};

const setDriverLocation = (driverId, wardId, lat, lng) => {
  driverLocations[driverId] = { driverId, wardId, lat, lng };
};

const getDrivers = () => {
  return Object.values(driverLocations);
};

const clearDriver = (driverId) => {
  delete driverLocations[driverId];
};

module.exports = { setDriverLocation, getDrivers, clearDriver };
