import React from 'react';

export default function AlertModal({
  alertMsg,
  alertTitle,
  isFading,
  dismissModal,
}) {
  if (!alertMsg) return null;

  return (
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
  );
}
