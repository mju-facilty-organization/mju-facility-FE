import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useSidebarStore } from '@/store/useSidebarStore';

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const { isOpen } = useSidebarStore();

  return (
    <>
      <aside
        className={`
          w-96
          ${!isOpen ? '-translate-x-full' : 'translate-x-0'}
          absolute top-0 left-0 h-full 
          transition-transform duration-300 z-40
        `}
      >
        <Sidebar />
      </aside>
      <main>
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </>
  );
};

export default StudentLayout;
