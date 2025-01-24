import AuthLayout from '@/components/feature/auth/AuthLayout';
import {
  SectionTitle,
  SectionContent,
} from '@/components/feature/auth/PrivacyComponents';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const PrivacyAgreement = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleNext = () => {
    if (isAgreed) navigate('/signup');
  };

  return (
    <AuthLayout title="개인정보 수집 및 이용 동의">
      <div className="space-y-8">
        <div>
          <SectionTitle>1. 개인정보 수집·이용 목적</SectionTitle>
          <SectionContent>
            · 회원가입, 가입인증 및 회원관리, 공간 대여 예약 신청 확인
          </SectionContent>
        </div>

        <div>
          <SectionTitle>2. 수집하는 개인정보 항목</SectionTitle>
          <SectionContent>
            · 회원가입: 이메일, 이름, 비밀번호, 학번, 학과, 학년, 휴대폰번호
            <br />· 가입인증 및 회원관리: 이메일, 이름
            <br />· 공간 대여 예약 신청 확인: 이름, 학번, 학과, 학년, 휴대폰번호
          </SectionContent>
        </div>

        <div>
          <SectionTitle>3. 개인정보 보유기간</SectionTitle>
          <SectionContent>· 이용 완료 후 1년까지 보관 후 폐기</SectionContent>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-6">
        <input
          type="checkbox"
          id="agreement"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
          className="w-5 h-5 border-gray-300 rounded text-myongji focus:ring-myongji"
        />
        <label htmlFor="agreement" className="text-gray-700 text-lg">
          위 개인정보수집이용에 동의합니다
        </label>
      </div>

      <div className="space-y-12 pt-6">
        <Button variant="primary" onClick={handleNext} disabled={!isAgreed}>
          다음으로
        </Button>
        <Button variant="secondary" onClick={() => navigate('/login')}>
          돌아가기
        </Button>
      </div>
    </AuthLayout>
  );
};

export default PrivacyAgreement;
