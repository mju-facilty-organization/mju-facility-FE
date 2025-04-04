export const getStatusStyles = (status: string) => {
  if (status && (status.includes('DENIED') || status.includes('REJECTED'))) {
    return 'bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium';
  } else if (
    status &&
    (status.includes('PERMITTED') || status.includes('APPROVED'))
  ) {
    return 'bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium';
  } else if (status && status.includes('WAITING')) {
    return 'bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium';
  } else {
    return 'bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium';
  }
};

export const getStatusText = (status: string) => {
  if (!status) return '-';

  if (status.includes('PERMITTED') || status.includes('APPROVED')) {
    return '승인';
  } else if (status.includes('DENIED') || status.includes('REJECTED')) {
    return '반려';
  } else if (status.includes('WAITING')) {
    return '승인대기';
  } else {
    return status;
  }
};
