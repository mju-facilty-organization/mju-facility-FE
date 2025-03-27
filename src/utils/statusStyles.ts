export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'REJECTED':
    case 'DENIED':
      return 'text-red-600 font-bold';
    case 'APPROVED':
    case 'PERMITTED':
      return 'text-blue-600 font-bold';
    default:
      return 'text-gray-900 font-bold';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'WAITING':
      return '승인대기';
    case 'APPROVED':
    case 'PERMITTED':
      return '승인';
    case 'REJECTED':
    case 'DENIED':
      return '반려';
    default:
      return status || '-';
  }
};
