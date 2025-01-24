import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import AuthLayout from '@/components/feature/auth/AuthLayout';
import LoginTabs from '@/components/feature/auth/LoginTabs';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

type TabType = 'student' | 'admin';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mockUser = {
        id: '1',
        name: '김명지',
        email: formData.email,
        role: activeTab.toUpperCase() as 'STUDENT' | 'ADMIN',
      };
      const mockToken = 'mock-token';
      login(mockUser, mockToken);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AuthLayout title="로그인">
      <LoginTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 border-gray-300 rounded text-myongji focus:ring-myongji"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-lg text-gray-custom"
            >
              로그인 상태 유지
            </label>
          </div>
          <button
            type="button"
            onClick={() => navigate('/verify')}
            className="text-lg text-gray-custom hover:text-gray-800"
          >
            비밀번호 찾기
          </button>
        </div>
        <Button variant="primary" type="submit">
          로그인
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/privacy-agreement')}
        >
          회원가입
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
