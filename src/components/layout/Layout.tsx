import { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BackgroundVector from '@/components/layout/BackgroundVector';
import AdminLayout from '@/components/layout/AdminLayout';
import StudentLayout from '@/components/layout/StudentLayout';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  const { user } = useAuthStore();

  const commonLayout = (content: ReactNode) => (
    <div
      className={`flex-1 bg-[#EDEDED] overflow-x-hidden relative ${className}`}
    >
      <div className="absolute inset-0">
        <BackgroundVector position="left" className="hidden sm:block" />
        <BackgroundVector position="right" className="hidden sm:block" />
      </div>
      <div className="relative">{content}</div>
    </div>
  );

  if (!user) {
    return commonLayout(
      <div className="container mx-auto px-4 py-8">{children}</div>
    );
  }

  return commonLayout(
    user.role === 'ADMIN' ? (
      <AdminLayout>{children}</AdminLayout>
    ) : (
      <StudentLayout>{children}</StudentLayout>
    )
  );
}
