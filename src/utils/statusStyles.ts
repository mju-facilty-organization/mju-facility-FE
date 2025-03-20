export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'REJECTED':
      return 'text-red-600 font-bold';
    case 'APPROVED':
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
      return '승인';
    case 'REJECTED':
      return '반려';
    default:
      return status || '-';
  }
};
