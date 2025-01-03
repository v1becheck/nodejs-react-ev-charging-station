const { Charger } = require('../models');

exports.getAllChargers = async (req, res) => {
  try {
    const chargers = await Charger.findAll();
    res.json(chargers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCharger = async (req, res) => {
  try {
    const { location, status } = req.body;
    const newCharger = await Charger.create({ location, status });
    res.status(201).json(newCharger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateChargerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const charger = await Charger.findByPk(id);
    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }
    charger.status = status;
    await charger.save();
    res.json(charger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
