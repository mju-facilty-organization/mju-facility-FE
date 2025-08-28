import { ReactNode } from 'react';
import PageTitle from '@/components/common/PageTitle';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col items-center ">
      <PageTitle>{title}</PageTitle>
      <div className="w-full max-w-[520px] min-h-[400px] p-10 sm:p-12 md:p-16 lg:p-20 mt-6 bg-white rounded-[20px] sm:rounded-[50px] shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
