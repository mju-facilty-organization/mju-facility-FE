import { useState } from 'react';
import { Reservation } from '@/types/reservation';
import { formatDate } from '@/utils/date';
import { getStatusStyles, getStatusText } from '@/utils/statusStyles';
import {
  useGetReservations,
  useGetReservationDetail,
} from '@/hooks/useReservation';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import Pagination from '@/components/common/Pagination';
import ReservationDetailModal from '@/components/feature/admin/reservationlist/ReservationDetailModal';

const PAGE_SIZE = 10;

type SearchParams = {
  page: number;
  size: number;
};

const AdminReservations = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useGetReservations(searchParams.page, searchParams.size);

  // 상세 정보 API 연결
  const {
    data: detailData,
    isLoading: isDetailLoading,
    error: detailError,
  } = useGetReservationDetail(selectedReservationId);

  const reservations: Reservation[] = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleDetailView = (reservationId: number) => {
    setSelectedReservationId(reservationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedReservationId(undefined);
    }, 300);
  };

  const safeFormatDate = (dateString?: string | null) => {
    return dateString ? formatDate(dateString) : '-';
  };

  if (queryError) {
    return (
      <div className="p-6 text-red-500 text-center">
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-myongji text-white rounded hover:bg-myongji/80"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-myongji font-bold">대여 신청 내역</h1>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myongji"></div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">데이터가 없습니다.</div>
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
                {reservations.map((reservation: Reservation, index: number) => {
                  const actualIndex =
                    searchParams.page * searchParams.size + index + 1;
                  return (
                    <tr
                      key={reservation.id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="py-4 px-5 text-center font-medium">
                        {actualIndex}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {reservation.facilityResponse?.facilityType
                          ? FACILITY_TYPE_MAP[
                              reservation.facilityResponse.facilityType
                            ] || reservation.facilityResponse.facilityType
                          : '-'}
                        {reservation.facilityResponse?.facilityNumber &&
                          ` - ${reservation.facilityResponse.facilityNumber}`}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {reservation.organization || '-'}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {reservation.purpose || '-'}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {safeFormatDate(reservation.createAt)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {safeFormatDate(reservation.defineDateTime)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`px-3 py-2 text-lg rounded-full ${getStatusStyles(
                            reservation.applicationResult || ''
                          )}`}
                        >
                          {getStatusText(reservation.applicationResult || '')}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() =>
                            handleDetailView(reservation.id as number)
                          }
                          className="px-4 py-2 text-lg text-white bg-myongji rounded hover:bg-myongji/80"
                          disabled={!reservation.id}
                        >
                          더보기
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && reservations.length > 0 && (
          <div className="flex justify-center items-center py-5 bg-gray-50 border-t">
            <Pagination
              currentPage={searchParams.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <ReservationDetailModal
          detailData={detailData}
          isLoading={isDetailLoading}
          error={detailError}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AdminReservations;
