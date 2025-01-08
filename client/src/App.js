import React, { useEffect, useState } from 'react';

import AlertModal from './components/AlertModal';
import ChargersTable from './components/ChargersTable';
import ReservationsTable from './components/ReservationsTable';
import UsersTable from './components/UsersTable';

import useFetchData from './hooks/useFetchData';

export default function App() {
  const [userId, setUserId] = useState('');
  const [now, setNow] = useState(Date.now());

  const [alertMsg, setAlertMsg] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [isFading, setIsFading] = useState(false);
  let fadeOutTimeout, removeTimeout;

  const showAlert = (message, title = 'Alert') => {
    setAlertMsg(message);
    setAlertTitle(title);
    setIsFading(false);

    fadeOutTimeout = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    removeTimeout = setTimeout(() => {
      setAlertMsg('');
      setAlertTitle('');
      setIsFading(false);
    }, 2000);
  };

  const dismissModal = () => {
    clearTimeout(fadeOutTimeout);
    clearTimeout(removeTimeout);
    setAlertMsg('');
    setAlertTitle('');
    setIsFading(false);
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const {
    data: chargers,
    // loading: chargersLoading,
    error: chargersError,
    refetch: fetchChargers,
  } = useFetchData(`${API_URL}/api/chargers`);

  const {
    data: reservations,
    // loading: reservationsLoading,s
    error: reservationsError,
    refetch: fetchReservations,
  } = useFetchData(`${API_URL}/api/reservations`);

  const {
    data: users,
    // loading: usersLoading,
    error: usersError,
    refetch: fetchUsers,
  } = useFetchData(`${API_URL}/api/users`);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateReservation = () => {
    if (!userId) {
      showAlert('Please enter a valid User ID!', 'Validation Error');
      return;
    }

    if (!reservations) {
      showAlert('Reservations not loaded yet!', 'Data Error');
      return;
    }

    const existingRes = reservations.find(
      (res) =>
        res.userId === parseInt(userId, 10) &&
        (res.status === 'queued' || res.status === 'active')
    );

    if (existingRes) {
      showAlert(
        'User already has a pending or active reservation. Cannot create another!',
        'Duplicate Reservation'
      );
      return;
    }

    fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: parseInt(userId, 10) }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error);
          });
        }
        return res.json();
      })
      .then((data) => {
        showAlert(
          `Reservation #${data.id} created (status: ${data.status})`,
          'Success'
        );

        fetchReservations();
      })
      .catch((err) => showAlert(err.message, 'Error'));
  };

  return (
    <div className='min-h-screen bg-gray-100 text-gray-800 p-4'>
      {/* ALERT MODAL */}
      <AlertModal
        alertMsg={alertMsg}
        alertTitle={alertTitle}
        isFading={isFading}
        dismissModal={dismissModal}
      />

      <div className='max-w-4xl mx-auto'>
        <header className='mb-8 text-center'>
          <h1 className='text-3xl font-bold mb-2'>EV Charging System</h1>
          <p className='text-sm text-gray-600'>
            Chargers, Reservations, and Users
          </p>
        </header>
        {chargersError && (
          <div className='text-red-500 mb-2'>
            Error loading chargers: {chargersError}
          </div>
        )}
        {reservationsError && (
          <div className='text-red-500 mb-2'>
            Error loading reservations: {reservationsError}
          </div>
        )}
        {usersError && (
          <div className='text-red-500 mb-2'>
            Error loading users: {usersError}
          </div>
        )}
        {/* CHARGERS TABLE */}
        {/* {chargersLoading ? (
          <p className='text-center mb-6'>Loading chargers...</p>
        ) : ( */}
        <ChargersTable
          chargers={chargers || []}
          reservations={reservations || []}
          now={now}
        />
        {/* )} */}
        {/* RESERVATIONS TABLE */}
        {/* {reservationsLoading ? (
          <p className='text-center mb-6'>Loading reservations...</p>
        ) : ( */}
        <ReservationsTable
          reservations={reservations || []}
          fetchReservations={fetchReservations}
          fetchChargers={fetchChargers}
          showAlert={showAlert}
          API_URL={API_URL}
        />
        {/* )} */}
        {/* USERS TABLE */}
        {/* {usersLoading ? (
          <p className='text-center mb-6'>Loading users...</p>
        ) : ( */}
        <UsersTable users={users || []} fetchUsers={fetchUsers} />
        {/* )} */}
        {/* CREATE NEW RESERVATION */}
        <section className='mb-8 bg-white shadow rounded p-4'>
          <h2 className='text-xl font-semibold mb-2'>Create New Reservation</h2>
          <div className='flex items-center space-x-2'>
            <label className='text-gray-700 font-medium'>User ID:</label>
            <input
              type='number'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className='border border-gray-300 rounded px-2 py-1 w-24'
            />
            <button
              onClick={handleCreateReservation}
              className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'
            >
              Enter Queue
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
