import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 md:w-80 lg:w-90 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>
      <main className="flex-1 min-h-screen">
        <div className="container mx-auto px-4 py-8 h-full">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
