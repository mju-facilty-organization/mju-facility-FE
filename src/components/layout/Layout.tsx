import { ReactNode } from 'react';
import BackgroundVector from '@/components/layout/BackgroundVector';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <main
      className={`relative flex-1 flex flex-col bg-[#EDEDED] overflow-hidden ${className}`}
    >
      <BackgroundVector position="left" className="hidden sm:block" />
      <BackgroundVector position="right" className="hidden sm:block" />
      <div className="container mx-auto px-4 pt-20 pb-8 relative ">
        {children}
      </div>
    </main>
  );
}
