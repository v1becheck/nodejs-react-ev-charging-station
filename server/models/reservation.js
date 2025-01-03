const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  status: {
    type: DataTypes.ENUM('queued', 'active', 'completed', 'cancelled'),
    defaultValue: 'queued',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Reservation;
