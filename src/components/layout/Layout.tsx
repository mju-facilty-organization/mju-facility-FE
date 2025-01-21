import { ReactNode } from 'react';
import BackgroundVector from '@/components/layout/BackgroundVector';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <main
      className={`relative min-h-screen flex flex-col bg-[#EDEDED] overflow-hidden ${className}`}
    >
      <BackgroundVector position="left" className="hidden sm:block" />
      <BackgroundVector position="right" className="hidden sm:block" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative max-w-7xl">
        {children}
      </div>
    </main>
  );
}
