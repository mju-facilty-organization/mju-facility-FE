import { FacilityInfo } from '@/components/feature/student/reservation/FacilityInfo';

const Reservation = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        인문캠퍼스 공간 예약하기
      </h1>
      <div className="bg-white border-4 border-myongji rounded-3xl p-10">
        <h2 className="text-3xl text-center mb-8">공간 예약 신청서</h2>
        <FacilityInfo />
      </div>
    </div>
  );
};

export default Reservation;
