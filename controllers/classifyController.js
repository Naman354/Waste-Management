const { classifyImage: callPython } = require('../services/pythonService.js');

const classifyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ category: 'unknown' });
    }

    const result = await callPython(req.file);
    res.json(result);
  } catch (err) {
    res.json({ category: 'unknown' });
  }
};

module.exports = { classifyImage };
