import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex h-full">
      <aside className="w-72 md:w-80 lg:w-96">
        <Sidebar />
      </aside>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
