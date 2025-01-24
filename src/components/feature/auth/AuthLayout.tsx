import { ReactNode } from 'react';
import PageTitle from '@/components/common/PageTitle';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col items-center">
      <PageTitle>{title}</PageTitle>
      <div className="w-full max-w-[520px] min-h-[400px] p-20 mt-4 bg-white rounded-[50px] shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
