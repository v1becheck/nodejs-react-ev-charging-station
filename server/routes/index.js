const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const chargerController = require('../controllers/chargerController');
const reservationController = require('../controllers/reservationController');

// Users
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);

// Chargers
router.get('/chargers', chargerController.getAllChargers);
router.post('/chargers', chargerController.createCharger);
router.patch('/chargers/:id', chargerController.updateChargerStatus);

// Reservations
router.get('/reservations', reservationController.getAllReservations);
router.post('/reservations', reservationController.createReservation);
router.patch('/reservations/:id/start', reservationController.startReservation);
router.patch(
  '/reservations/:id/complete',
  reservationController.completeReservation
);
router.patch(
  '/reservations/:id/cancel',
  reservationController.cancelReservation
);

module.exports = router;
