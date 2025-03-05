import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchBar } from '@/components/feature/admin/reservationlist/SearchBar';
import { Reservation } from '@/types/reservation';
import { formatDate } from '@/utils/date';
import { getStatusStyles } from '@/utils/statusStyles';

const AdminReservations = () => {
  const [reservations] = useState<Reservation[]>([
    {
      id: 1,
      organization: 'COW',
      purpose: '동아리 활동',
      createAt: '2025-02-02T22:49:40.772231',
      defineDateTime: null,
      result: '반려',
      facilityResponse: {
        facilityType: '1350',
      },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);

  const categories = ['통합검색', '대여인/단체', '위치', '예약 일시', '상태'];

  const handleSearch = async (category: string, query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: API 호출
      console.log('검색 카테고리:', category);
      console.log('검색어:', query);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // TODO: API 호출하여 해당 페이지 데이터 가져오기
  };

  const handleDetailView = (reservationId: number) => {
    // TODO: 상세 보기 모달 열기 또는 페이지 이동
    console.log('상세 보기:', reservationId);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6 text-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-myongji font-bold">대여 신청 내역</h1>
        <SearchBar categories={categories} onSearch={handleSearch} />
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">검색 결과가 없습니다.</div>
          ) : (
            <table className="min-w-full text-lg">
              <thead>
                <tr className="bg-gray-50 text-xl">
                  <th className="py-4 px-5 text-center">번호</th>
                  <th className="py-4 px-5 text-center">대여 공간</th>
                  <th className="py-4 px-5 text-center">대여인/단체</th>
                  <th className="py-4 px-5 text-center">이용 목적</th>
                  <th className="py-4 px-5 text-center">신청 일시</th>
                  <th className="py-4 px-5 text-center">처리 일시</th>
                  <th className="py-4 px-5 text-center">상태</th>
                  <th className="py-4 px-5 text-center">세부 항목</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-lg">
                {reservations.map((reservation, index) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="py-4 px-5 text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {reservation.facilityResponse.facilityType}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {reservation.organization}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {reservation.purpose}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {formatDate(reservation.createAt)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {formatDate(reservation.defineDateTime)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-3 py-2 text-lg rounded-full ${getStatusStyles(
                          reservation.result
                        )}`}
                      >
                        {reservation.result}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => handleDetailView(reservation.id)}
                        className="px-4 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        더보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-center items-center py-5 bg-gray-50 border-t">
          <nav className="inline-flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded text-blue-500 disabled:text-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {renderPagination().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === 'number' && handlePageChange(page)
                }
                className={`px-4 py-2 rounded text-lg
                  ${
                    page === currentPage
                      ? 'bg-blue-500 text-white'
                      : typeof page === 'number'
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-gray-400 cursor-default'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded text-blue-500 disabled:text-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;
