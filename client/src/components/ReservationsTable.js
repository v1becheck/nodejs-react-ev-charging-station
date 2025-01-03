import React from 'react';
import { getStatusClasses } from '../utils/getStatusClasses';

export default function ReservationsTable({
  reservations,
  fetchReservations,
  fetchChargers,
  showAlert,
  API_URL,
}) {
  function handleStartReservation(id) {
    fetch(`${API_URL}/api/reservations/${id}/start`, { method: 'PATCH' })
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
  }

  function handleCompleteReservation(id) {
    fetch(`${API_URL}/api/reservations/${id}/complete`, { method: 'PATCH' })
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
  }

  function handleCancelReservation(id) {
    fetch(`${API_URL}/api/reservations/${id}/cancel`, { method: 'PATCH' })
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
  }

  return (
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
                  <span className={getStatusClasses('reservation', res.status)}>
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
  );
}
