import React, { useEffect, useState, useCallback } from 'react';

function App() {
  const [chargers, setChargers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');

  const [now, setNow] = useState(Date.now());

  const MAX_TIME_STRING = '4:00:00';

  const [alertMsg, setAlertMsg] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [isFading, setIsFading] = useState(false);

  let fadeOutTimeout, removeTimeout;

  const showAlert = (message, title = 'Alert') => {
    setAlertMsg(message);
    setAlertTitle(title);
    setIsFading(false);

    // Fade out after 1.5s
    fadeOutTimeout = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    // Remove entirely after 2s
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

  const fetchChargers = useCallback(() => {
    fetch(`${API_URL}/api/chargers`)
      .then((res) => res.json())
      .then((data) => setChargers(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  const fetchReservations = useCallback(() => {
    fetch(`${API_URL}/api/reservations`)
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  const fetchUsers = useCallback(() => {
    fetch(`${API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  useEffect(() => {
    fetchChargers();
    fetchReservations();
    fetchUsers();

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [API_URL, fetchChargers, fetchReservations, fetchUsers]);

  function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  function getActiveReservationForCharger(chargerId) {
    return reservations.find(
      (res) => res.chargerId === chargerId && res.status === 'active'
    );
  }

  function getStatusClasses(type, status) {
    const base = 'font-bold ';
    if (type === 'reservation') {
      switch (status) {
        case 'queued':
          return `${base} text-yellow-500`;
        case 'active':
          return `${base} text-green-500`;
        case 'completed':
          return `${base} text-blue-500`;
        case 'cancelled':
          return `${base} text-red-500`;
        default:
          return `${base} text-gray-400`;
      }
    } else {
      // Charger statuses: available, in_use, unavailable
      switch (status) {
        case 'available':
          return `${base} text-green-600`;
        case 'in_use':
          return `${base} text-yellow-600`;
        case 'unavailable':
          return `${base} text-red-600`;
        default:
          return `${base} text-gray-400`;
      }
    }
  }

  const handleCreateReservation = () => {
    if (!userId) {
      showAlert('Please enter a valid User ID!', 'Validation Error');
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

  const handleStartReservation = (id) => {
    fetch(`${API_URL}/api/reservations/${id}/start`, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          showAlert(data.error, 'Cannot Start');
        } else {
          showAlert(`Reservation #${data.id} started!`, 'Success');
        }
        fetchReservations();
        fetchChargers();
      })
      .catch((err) => showAlert(err.message, 'Error'));
  };

  const handleCompleteReservation = (id) => {
    fetch(`${API_URL}/api/reservations/${id}/complete`, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          showAlert(data.error, 'Cannot Complete');
        } else {
          showAlert(`Reservation #${data.id} completed!`, 'Success');
        }
        fetchReservations();
        fetchChargers();
      })
      .catch((err) => showAlert(err.message, 'Error'));
  };

  const handleCancelReservation = (id) => {
    fetch(`${API_URL}/api/reservations/${id}/cancel`, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          showAlert(data.error, 'Cannot Cancel');
        } else {
          showAlert(`Reservation #${data.id} canceled!`, 'Success');
        }
        fetchReservations();
        fetchChargers();
      })
      .catch((err) => showAlert(err.message, 'Error'));
  };

  return (
    <div className='min-h-screen bg-gray-100 text-gray-800 p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* ----- ALERT Modal ----- */}
        {alertMsg && (
          <div
            className={`
              fixed inset-0 z-50 flex items-center justify-center
              bg-black bg-opacity-50
              transition-opacity duration-500
              ${isFading ? 'opacity-0' : 'opacity-100'}
            `}
          >
            <div className='bg-white w-72 sm:w-96 p-6 rounded shadow-lg text-center relative'>
              <h2 className='text-lg font-semibold mb-2 text-gray-800'>
                {alertTitle}
              </h2>
              <div className='text-gray-700 mb-4'>{alertMsg}</div>
              <button
                onClick={dismissModal}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                OK
              </button>
            </div>
          </div>
        )}

        <header className='mb-8 text-center'>
          <h1 className='text-3xl font-bold mb-2'>EV Charging System</h1>
          <p className='text-sm text-gray-600'>
            Chargers, Reservations, and Users
          </p>
        </header>

        {/* ========== CHARGERS SECTION ========== */}
        <section className='mb-8 bg-white shadow rounded p-4'>
          <h2 className='text-xl font-semibold mb-4'>Chargers</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left border'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='p-2 border-b'>ID</th>
                  <th className='p-2 border-b'>Location</th>
                  <th className='p-2 border-b'>Status</th>
                  <th className='p-2 border-b'>User</th>
                  <th className='p-2 border-b'>Time Spent</th>
                  <th className='p-2 border-b'>Max Time</th>
                </tr>
              </thead>
              <tbody>
                {chargers.map((charger) => {
                  const activeRes = getActiveReservationForCharger(charger.id);
                  let userName = 'N/A';
                  let timeSpent = '00:00:00';

                  if (activeRes) {
                    userName = activeRes.User ? activeRes.User.name : 'Unknown';
                    if (activeRes.startTime) {
                      const msDiff =
                        now - new Date(activeRes.startTime).getTime();
                      timeSpent = formatTime(msDiff);
                    }
                  }

                  return (
                    <tr key={charger.id} className='hover:bg-gray-100'>
                      <td className='p-2 border-b'>{charger.id}</td>
                      <td className='p-2 border-b'>{charger.location}</td>
                      <td className='p-2 border-b'>
                        <span
                          className={getStatusClasses(
                            'charger',
                            charger.status
                          )}
                        >
                          {charger.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className='p-2 border-b'>{userName}</td>
                      <td className='p-2 border-b'>{timeSpent}</td>
                      <td className='p-2 border-b'>{MAX_TIME_STRING}</td>
                    </tr>
                  );
                })}
                {chargers.length === 0 && (
                  <tr>
                    <td colSpan={6} className='p-2 text-center'>
                      No chargers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== RESERVATIONS SECTION ========== */}
        <section className='mb-8 bg-white shadow rounded p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Reservations</h2>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              onClick={fetchReservations}
            >
              Refresh
            </button>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left border'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='p-2 border-b'>ID</th>
                  <th className='p-2 border-b'>User</th>
                  <th className='p-2 border-b'>Status</th>
                  <th className='p-2 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className='hover:bg-gray-100'>
                    <td className='p-2 border-b'>{res.id}</td>
                    <td className='p-2 border-b'>{res.User?.name}</td>
                    <td className='p-2 border-b'>
                      <span
                        className={getStatusClasses('reservation', res.status)}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className='p-2 border-b space-x-2'>
                      {res.status === 'queued' && (
                        <button
                          className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
                          onClick={() => handleStartReservation(res.id)}
                        >
                          Start
                        </button>
                      )}
                      {res.status === 'active' && (
                        <button
                          className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                          onClick={() => handleCompleteReservation(res.id)}
                        >
                          Complete
                        </button>
                      )}
                      {(res.status === 'queued' || res.status === 'active') && (
                        <button
                          className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                          onClick={() => handleCancelReservation(res.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={4} className='p-2 text-center'>
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== USERS SECTION ========== */}
        <section className='mb-8 bg-white shadow rounded p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Users</h2>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              onClick={fetchUsers}
            >
              Refresh
            </button>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left border'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='p-2 border-b'>ID</th>
                  <th className='p-2 border-b'>Name</th>
                  <th className='p-2 border-b'>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-gray-100'>
                    <td className='p-2 border-b'>{user.id}</td>
                    <td className='p-2 border-b'>{user.name}</td>
                    <td className='p-2 border-b'>{user.email}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className='p-2 text-center'>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== CREATE NEW RESERVATION ========== */}
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

export default App;
