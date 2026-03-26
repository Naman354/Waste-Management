const Bin = require('../models/Bin');
const { getDrivers } = require('../memory/driverStore.js');

const getStats = async (req, res) => {
  try {
    const [totalBins, fullBins, fillingBins, emptyBins] = await Promise.all([
      Bin.countDocuments(),
      Bin.countDocuments({ status: 'Full' }),
      Bin.countDocuments({ status: 'Filling' }),
      Bin.countDocuments({ status: 'Empty' }),
    ]);

    const activeDrivers = getDrivers().length;

    res.json({ totalBins, fullBins, fillingBins, emptyBins, activeDrivers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats };
