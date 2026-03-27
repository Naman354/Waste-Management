const Bin = require('../models/Bin');
const { getDrivers } = require('../memory/driverStore.js');
const KOLKATA_TIMEZONE = 'Asia/Kolkata';

const getDatePartsInKolkata = (date) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: KOLKATA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });

  return formatter.formatToParts(date).reduce((parts, part) => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }
    return parts;
  }, {});
};

const getKolkataDayKey = (date) => {
  const { year, month, day } = getDatePartsInKolkata(date);
  return `${year}-${month}-${day}`;
};

const getKolkataHourKey = (date) => {
  const { year, month, day, hour } = getDatePartsInKolkata(date);
  return `${year}-${month}-${day} ${hour}`;
};

const getKolkataHourLabel = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: KOLKATA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

const getKolkataDayLabel = (date) => getDatePartsInKolkata(date).weekday;

const getKolkataDateLabel = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: KOLKATA_TIMEZONE,
    day: 'numeric',
    month: 'short',
  }).format(date);

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
    let startDate;
    let groupFormat;

    if (range === '24h') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d %H';
    } else if (range === '7d') {
      startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
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
              timezone: KOLKATA_TIMEZONE,
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
      const labels = [];
      const data = [];
      for (let i = 0; i < 24; i++) {
        const d = new Date(startDate.getTime() + i * 60 * 60 * 1000);
        labels.push(getKolkataHourLabel(d));
        data.push(resultMap[getKolkataHourKey(d)] || 0);
      }
      return res.json({ labels, data });
    }

    if (range === '7d') {
      const labels = [];
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(getKolkataDayLabel(d));
        data.push(resultMap[getKolkataDayKey(d)] || 0);
      }
      return res.json({ labels, data });
    }

    if (range === '30d') {
      const labels = [];
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(getKolkataDateLabel(d));
        data.push(resultMap[getKolkataDayKey(d)] || 0);
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
