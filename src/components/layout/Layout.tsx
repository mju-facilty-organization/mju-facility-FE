import { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import BackgroundVector from '@/components/layout/BackgroundVector';
import AdminLayout from '@/components/layout/AdminLayout';
import Sidebar from '@/components/layout/Sidebar';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  const { user } = useAuthStore();
  const { isOpen } = useSidebarStore();

  const commonLayout = (content: ReactNode) => (
    <div className={`bg-[#EDEDED] relative ${className}`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BackgroundVector position="left" className="hidden sm:block" />
        <BackgroundVector position="right" className="hidden sm:block" />
      </div>
      <div className="relative">{content}</div>
    </div>
  );

  if (user?.role === 'ADMIN') {
    return commonLayout(<AdminLayout>{children}</AdminLayout>);
  }

  return commonLayout(
    <div className="relative ">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {}}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-screen w-80 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <Sidebar />
      </aside>

      <main className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
