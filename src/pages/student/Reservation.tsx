import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FacilityInfo } from '@/components/feature/student/reservation/FacilityInfo';
import { TimeTable } from '@/components/feature/student/reservation/TimeTable';
import ReservationForm from '@/components/feature/student/reservation/ReservationForm';
import { useFacilityDetail } from '@/hooks/useFacility';
import { Facility } from '@/types/facility';
import { getTodayLocal } from '@/utils/date';

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocal());
  const { facilityId } = useParams<{ facilityId: string }>();
  const { data, isLoading, isError } = useFacilityDetail(
    facilityId,
    selectedDate
  );
  const facilityData = data?.data as Facility | undefined;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-12">
          인문캠퍼스 공간 예약하기
        </h1>
        <div className="bg-white border-4 border-myongji rounded-3xl p-10 flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-myongji rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-12">
          인문캠퍼스 공간 예약하기
        </h1>
        <div className="bg-white border-4 border-myongji rounded-3xl p-10">
          <div className="text-red-500 text-center">
            시설 정보를 불러오는데 실패했습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        인문캠퍼스 공간 예약하기
      </h1>
      <div className="bg-white border-4 border-myongji rounded-3xl p-10">
        <h2 className="text-3xl text-center mb-8">공간 예약 신청서</h2>

        <FacilityInfo facilityData={facilityData} />
        <TimeTable
          facilityData={facilityData}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <ReservationForm selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Reservation;
