const { Reservation, Charger, User } = require('../models');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [User, Charger],
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { userId } = req.body;
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const newRes = await Reservation.create({ userId, status: 'queued' });
    res.status(201).json(newRes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.startReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      include: [Charger, User],
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    if (reservation.status === 'active') {
      return res.status(400).json({ error: 'Already active' });
    }

    const availableCharger = await Charger.findOne({
      where: { status: 'available' },
    });
    if (!availableCharger) {
      return res.status(400).json({ error: 'No chargers available' });
    }

    availableCharger.status = 'in_use';
    await availableCharger.save();

    reservation.chargerId = availableCharger.id;
    reservation.status = 'active';
    reservation.startTime = new Date();
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      include: Charger,
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    if (reservation.status !== 'active') {
      return res.status(400).json({ error: 'Reservation not active' });
    }

    if (reservation.Charger) {
      reservation.Charger.status = 'available';
      await reservation.Charger.save();
    }

    reservation.status = 'completed';
    reservation.endTime = new Date();
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      include: Charger,
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.status === 'active' && reservation.Charger) {
      reservation.Charger.status = 'available';
      await reservation.Charger.save();
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
