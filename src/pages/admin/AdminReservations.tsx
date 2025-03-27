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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-myongji font-bold">대여 신청 내역</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-myongji"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">데이터가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      번호
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      대여 공간
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      단체
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      이용 목적
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      신청 일시
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      처리 일시
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      교수 승인
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      상태
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500">
                      세부 항목
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map(
                    (reservation: Reservation, index: number) => {
                      const actualIndex =
                        searchParams.page * searchParams.size + index + 1;
                      return (
                        <tr
                          key={reservation.id || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {actualIndex}
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {reservation.facilityResponse?.facilityType
                              ? FACILITY_TYPE_MAP[
                                  reservation.facilityResponse.facilityType
                                ] || reservation.facilityResponse.facilityType
                              : '-'}
                            {reservation.facilityResponse?.facilityNumber &&
                              ` - ${reservation.facilityResponse.facilityNumber}`}
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {reservation.organization || '-'}
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {reservation.purpose || '-'}
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {safeFormatDate(reservation.createAt)}
                          </td>

                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {safeFormatDate(reservation.defineDateTime)}
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-custom text-center">
                            {typeof reservation.professorApprovalResponse ===
                            'string'
                              ? reservation.professorApprovalResponse
                              : '-'}
                          </td>
                          <td className="px-6 py-4 text-lg text-center">
                            <span
                              className={`px-3 py-2 text-lg rounded-full ${getStatusStyles(
                                reservation.applicationResult || ''
                              )}`}
                            >
                              {getStatusText(
                                reservation.applicationResult || ''
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-lg text-center">
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
                    }
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={searchParams.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
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
