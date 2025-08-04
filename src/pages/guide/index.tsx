import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import ReservationProcess from '@/components/feature/guide/ReservationProcess';
import { useEffect } from 'react';

const Guide = () => {
  const { isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/reservation');
      }
    }
  }, [isLoggedIn, user?.role, navigate]);

  if (isLoggedIn) return null;

  const normalSteps = [
    '홈페이지 접속',
    '회원가입 및 로그인',
    '[공간예약] 버튼 클릭',
    '이용 희망 공간 선택',
    '예약 일자 및 시간 선택',
    '예약 시간/이용 목적 입력',
    '예약 신청',
    '담당자 승인',
    '예약 완료',
  ];

  const regularSteps = [...normalSteps];
  regularSteps[2] = '[정기예약] 버튼 클릭';

  return (
    <div className="w-full max-w-[1000px] h-[500px] bg-white rounded-[50px] border-8 border-myongji p-10 overflow-auto mx-auto">
      <PageTitle>온라인 공간 예약 시스템 이용안내</PageTitle>

      <div className="space-y-10 max-w-7xl mx-auto mt-4">
        <ReservationProcess title="공간 예약 절차" steps={normalSteps} />
        <ReservationProcess title="정기 예약 절차" steps={regularSteps} />

        <div>
          <h2 className="text-2xl font-semibold mb-4">유의사항</h2>
          <p className="text-2xl text-gray-custom">
            (**기존 명지대학교 대여 내규를 따름.)
          </p>
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="bg-myongji text-white px-10 py-4 rounded-lg text-xl hover:bg-opacity-90 transition-colors"
            onClick={() => {
              navigate('/reservation');
            }}
          >
            공간 예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guide;
