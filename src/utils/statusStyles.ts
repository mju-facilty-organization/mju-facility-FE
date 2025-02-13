export const getStatusStyles = (status: string) => {
  switch (status) {
    case '반려':
      return 'text-red-600';
    case '승인':
      return 'text-blue-600';
    default:
      return 'text-gray-900';
  }
};
