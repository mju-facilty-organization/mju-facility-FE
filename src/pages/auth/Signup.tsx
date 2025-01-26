import AuthLayout from '@/components/feature/auth/AuthLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    major: '',
    studentId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 제출:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AuthLayout title="회원가입">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-8">
          <Input
            label="이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="텍스트를 입력하세요"
          />

          <div className="relative">
            <Input
              type="email"
              label="이메일"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="텍스트를 입력하세요"
              description="※ 인증번호를 받기 위해 정확한 명지대학교 이메일 주소를 입력해주세요"
            />
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 bg-myongji text-white rounded text-lg"
            >
              발송
            </button>
          </div>

          <Input
            type="password"
            label="비밀번호"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />

          <Input
            type="password"
            label="비밀번호 확인"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호를 재입력하세요"
            description="※ 비밀번호는 영문/숫자/특수문자를 포함해서 8-20글자로 작성해주세요"
          />

          <Input
            label="학번"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="텍스트를 입력하세요"
          />

          <Input
            label="학과"
            name="major"
            value={formData.major}
            onChange={handleChange}
            placeholder="텍스트를 입력하세요"
          />

          <Input
            type="tel"
            label="연락처"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="텍스트를 입력하세요"
          />
        </div>

        <div className="pt-8 space-y-4">
          <Button variant="primary" type="submit">
            완료
          </Button>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            취소
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
