import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/date';
import { FACILITY_TYPE_MAP } from '@/constants/building';
import { getStatusStyles, getStatusText } from '@/utils/statusStyles';
import { AlertTriangle, Plus } from 'lucide-react';
import { Reservation } from '@/types/reservation';
import { useGetCurrentMember } from '@/hooks/useMember';
import { useGetStudentReservations } from '@/hooks/useReservation';

const StudentReservationHistory = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useGetCurrentMember();

  const memberId = memberData?.data?.id;
  const {
    data: reservationData,
    isLoading: isReservationLoading,
    error: reservationError,
  } = useGetStudentReservations(memberId?.toString());

  useEffect(() => {
    setIsLoading(isMemberLoading || isReservationLoading);

    if (memberError) {
      console.error(
        '회원 정보를 불러오는 중 오류가 발생했습니다.',
        memberError
      );
      setError('회원 정보를 불러오는 중 오류가 발생했습니다.');
      return;
    }

    if (reservationError) {
      console.error(
        '예약 내역을 불러오는 중 오류가 발생했습니다.',
        reservationError
      );
      setError('예약 내역을 불러오는 중 오류가 발생했습니다.');
      return;
    }

    if (reservationData) {
      if (reservationData.resultType === 'SUCCESS') {
        setReservations(reservationData.data);
        setError(null);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    }
  }, [
    memberData,
    reservationData,
    isMemberLoading,
    isReservationLoading,
    memberError,
    reservationError,
  ]);

  return (
    <div className="container mx-auto px-2 py-10 max-w-full">
      <h1 className="text-4xl font-bold mb-8 text-myongji pb-3 border-b-2 border-myongji">
        내 예약 내역
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myongji"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-5 rounded-md shadow mb-6 text-lg">
          <p className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            {error}
          </p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center shadow-sm">
          <Plus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-xl">아직 예약 내역이 없습니다.</p>
          <p className="text-gray-500 mt-2">새로운 시설 예약을 진행해보세요.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-myongji-light">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-myongji-light border-b border-myongji-light">
                <tr>
                  <th className="px-6 py-5 text-center text-base font-semibold text-myongji uppercase tracking-wider">
                    시설
                  </th>
                  <th className="px-6 py-5 text-center text-base font-semibold text-myongji uppercase tracking-wider">
                    신청 날짜
                  </th>
                  <th className="px-6 py-5 text-center text-base font-semibold text-myongji uppercase tracking-wider">
                    단체 / 목적
                  </th>
                  <th className="px-6 py-5 text-center text-base font-semibold text-myongji uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-5 text-center text-base font-semibold text-myongji uppercase tracking-wider">
                    교수 승인
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, index) => (
                  <tr
                    key={reservation.id}
                    className={`hover:bg-myongji-pale transition-colors duration-150 ${
                      index !== reservations.length - 1
                        ? 'border-b border-myongji-light'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="text-xl font-medium text-gray-900">
                        {(reservation.facilityResponse?.facilityType &&
                          FACILITY_TYPE_MAP[
                            reservation.facilityResponse.facilityType
                          ]) ||
                          '-'}{' '}
                        {reservation.facilityResponse?.facilityNumber}호
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="text-lg text-gray-900 font-medium">
                        {reservation.createAt
                          ? formatDate(reservation.createAt)
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="text-lg text-gray-900">
                        {reservation.organization ? (
                          <span className="font-medium">
                            {reservation.organization}
                          </span>
                        ) : (
                          ''
                        )}
                        {reservation.organization ? ' / ' : ''}
                        {reservation.purpose || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span
                        className={`px-4 py-2 text-base font-semibold rounded-full ${getStatusStyles(
                          reservation.applicationResult
                        )}`}
                      >
                        {getStatusText(reservation.applicationResult)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      {reservation.professorApprovalResponse ? (
                        <span
                          className={`px-4 py-2 text-base font-semibold rounded-full ${getStatusStyles(
                            reservation.applicationResult
                          )}`}
                        >
                          {getStatusText(reservation.applicationResult)}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-lg">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReservationHistory;
