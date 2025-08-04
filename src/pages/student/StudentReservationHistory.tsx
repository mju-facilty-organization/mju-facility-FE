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
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-myongji pb-2 border-b-2 border-myongji">
          내 예약 내역
        </h1>
        {!isLoading && !error && reservations.length > 0 && (
          <a
            href="/reservation"
            className="px-4 py-2 bg-myongji text-white font-medium rounded-md hover:bg-opacity-90 transition-all"
          >
            새 예약
          </a>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myongji"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-md mb-6">
          <p className="flex items-center text-lg">
            <AlertTriangle className="h-6 w-6 mr-3" />
            {error}
          </p>
          <p className="mt-2 ml-9 text-red-600 opacity-80">
            다시 시도하거나 관리자에게 문의해주세요.
          </p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-md">
          <div className="bg-myongji-pale p-6 rounded-full inline-flex items-center justify-center mb-6">
            <Plus className="h-12 w-12 text-myongji" />
          </div>
          <p className="text-gray-800 text-2xl font-bold mb-3">
            아직 예약 내역이 없습니다
          </p>
          <p className="text-gray-500 text-lg mb-8">
            새로운 시설 예약을 진행해보세요
          </p>
          <a
            href="/reservation"
            className="inline-flex items-center px-6 py-3 bg-myongji text-white font-semibold rounded-lg transition-all duration-300 hover:bg-opacity-90"
          >
            시설 예약하기
          </a>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-myongji bg-opacity-10">
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
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, index) => (
                  <tr
                    key={reservation.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index !== reservations.length - 1
                        ? 'border-b border-gray-200'
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
                        {reservation.facilityResponse?.facilityNumber}
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
