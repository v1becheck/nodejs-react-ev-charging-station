export function getStatusClasses(type, status) {
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
    // Charger statuses
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
