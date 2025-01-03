import React from 'react';

export default function UsersTable({ users, fetchUsers }) {
  return (
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
  );
}
