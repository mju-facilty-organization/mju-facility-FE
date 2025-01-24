import TabButton from '@/components/feature/auth/TabButton';

interface LoginTabsProps {
  activeTab: 'student' | 'admin';
  onTabChange: (tab: 'student' | 'admin') => void;
}

const LoginTabs = ({ activeTab, onTabChange }: LoginTabsProps) => {
  return (
    <div className="flex mb-12 border-b">
      <TabButton
        isActive={activeTab === 'student'}
        onClick={() => onTabChange('student')}
      >
        일반 로그인
      </TabButton>
      <TabButton
        isActive={activeTab === 'admin'}
        onClick={() => onTabChange('admin')}
      >
        관리자 로그인
      </TabButton>
    </div>
  );
};

export default LoginTabs;
