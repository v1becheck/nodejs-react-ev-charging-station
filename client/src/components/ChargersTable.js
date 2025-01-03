import React from 'react';
import { formatTime } from '../utils/formatTime';
import { getStatusClasses } from '../utils/getStatusClasses';

export default function ChargersTable({ chargers, reservations, now }) {
  const MAX_TIME_STRING = '4:00:00';

  function getActiveReservationForCharger(chargerId) {
    return reservations.find(
      (res) => res.chargerId === chargerId && res.status === 'active'
    );
  }

  return (
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
                  const msDiff = now - new Date(activeRes.startTime).getTime();
                  timeSpent = formatTime(msDiff);
                }
              }

              return (
                <tr key={charger.id} className='hover:bg-gray-100'>
                  <td className='p-2 border-b'>{charger.id}</td>
                  <td className='p-2 border-b'>{charger.location}</td>
                  <td className='p-2 border-b'>
                    <span
                      className={getStatusClasses('charger', charger.status)}
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
  );
}
