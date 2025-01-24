import AuthLayout from '@/components/feature/auth/AuthLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const Verify = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 본인인증 로직 구현
    navigate('/login');
  };

  return (
    <AuthLayout title="본인인증">
      <div className="text-center mb-12">
        <div className="text-center text-black text-2xl font-normal font-['Noto Sans'] leading-relaxed">
          비밀번호를 잃어버리셨나요?
          <br />
          하단의 정보를 상세히 입력하세요
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 bg-myongji text-white rounded text-base"
              onClick={() => console.log('인증번호 발송')}
            >
              발송
            </button>
          </div>

          <div className="text-base text-gray-500 mt-4 leading-relaxed">
            ※ 인증번호를 받기 위해
            <br />
            정확한 명지대학교 이메일 주소를 입력해주세요
          </div>
        </div>

        <Button type="submit" variant="primary">
          돌아가기
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Verify;
