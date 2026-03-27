const Bin = require('../models/Bin');
const { getDrivers } = require('../memory/driverStore.js');

// GET /stats
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

// GET /stats/trends?range=24h|7d|30d
const getTrends = async (req, res) => {
  try {
    const range = req.query.range || '24h';
    const now = new Date();
    let startDate, groupFormat, labels, labelCount;

    if (range === '24h') {
      // Last 24 hours, grouped by hour
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      groupFormat = '%H';
      labelCount = 24;
    } else if (range === '7d') {
      // Last 7 days, grouped by day
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
      labelCount = 7;
    } else if (range === '30d') {
      // Last 30 days, grouped by day
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
      labelCount = 30;
    } else {
      return res.status(400).json({ error: 'Invalid range. Use 24h, 7d, or 30d.' });
    }

    const pipeline = [
      {
        $match: {
          lastUpdated: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: '$lastUpdated',
              timezone: 'Asia/Kolkata',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const rawResults = await Bin.aggregate(pipeline);

    // Build a complete label set with 0s for missing periods
    const resultMap = {};
    rawResults.forEach((r) => {
      resultMap[r._id] = r.count;
    });

    if (range === '24h') {
      labels = [];
      const data = [];
      for (let i = 0; i < 24; i++) {
        const d = new Date(startDate.getTime() + i * 60 * 60 * 1000);
        const hour = d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        });
        const key = String(d.getUTCHours() + 5).padStart(2, '0'); // approximate IST offset
        labels.push(hour);
        data.push(resultMap[String(i).padStart(2, '0')] || 0);
      }
      return res.json({ labels, data });
    }

    if (range === '7d') {
      labels = [];
      const data = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        labels.push(dayNames[d.getDay()]);
        data.push(resultMap[key] || 0);
      }
      return res.json({ labels, data });
    }

    if (range === '30d') {
      labels = [];
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          timeZone: 'Asia/Kolkata',
        });
        labels.push(label);
        data.push(resultMap[key] || 0);
      }
      return res.json({ labels, data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /stats/categories
const getCategoryStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          full: { $sum: { $cond: [{ $eq: ['$status', 'Full'] }, 1, 0] } },
          filling: { $sum: { $cond: [{ $eq: ['$status', 'Filling'] }, 1, 0] } },
          empty: { $sum: { $cond: [{ $eq: ['$status', 'Empty'] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ];

    const results = await Bin.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /stats/wards
const getWardStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$wardId',
          total: { $sum: 1 },
          full: { $sum: { $cond: [{ $eq: ['$status', 'Full'] }, 1, 0] } },
          filling: { $sum: { $cond: [{ $eq: ['$status', 'Filling'] }, 1, 0] } },
          empty: { $sum: { $cond: [{ $eq: ['$status', 'Empty'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const results = await Bin.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats, getTrends, getCategoryStats, getWardStats };