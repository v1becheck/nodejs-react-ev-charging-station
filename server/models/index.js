const sequelize = require('../config/database');
const User = require('./user');
const Charger = require('./charger');
const Reservation = require('./reservation');

// Define associations
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Charger.hasMany(Reservation, { foreignKey: 'chargerId' });
Reservation.belongsTo(Charger, { foreignKey: 'chargerId' });

module.exports = {
  sequelize,
  User,
  Charger,
  Reservation,
};
