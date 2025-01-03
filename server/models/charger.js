const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Charger = sequelize.define('Charger', {
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'in_use', 'unavailable'),
    defaultValue: 'available',
  },
});

module.exports = Charger;
