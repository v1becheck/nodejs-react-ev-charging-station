const express = require('express');
const cors = require('cors');
const { sequelize, User, Charger, Reservation } = require('./models');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3001;

// Sync db
sequelize.sync({ force: true }).then(async () => {
  console.log('Database synchronized!');

  // Seed data
  const userA = await User.create({
    name: 'Sofia',
    email: 'sofia@example.com',
  });
  const userB = await User.create({
    name: 'Bradly',
    email: 'bradly@example.com',
  });
  const userC = await User.create({
    name: 'Milos',
    email: 'milos@example.com',
  });
  const userD = await User.create({ name: 'Mike', email: 'mike@example.com' });
  const userE = await User.create({
    name: 'Marko',
    email: 'marko@example.com',
  });

  await Charger.create({ location: 'Charger #1', status: 'available' });
  await Charger.create({ location: 'Charger #2', status: 'available' });
  await Charger.create({ location: 'Charger #3', status: 'available' });

  // Example reservation
  await Reservation.create({ userId: userA.id, status: 'queued' });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
