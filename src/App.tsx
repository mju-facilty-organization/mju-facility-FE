import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import NotificationBanner from '@/pages/notice/NotificationBanner';
import ChatbotFloatingButton from '@/components/chatbot/chatbotFloatingButton';
import { useAuthStore } from '@/store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

export default function App() {
  const { user } = useAuthStore();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        {user?.role !== 'ADMIN' && <NotificationBanner />}
        <Layout className="flex-1">
          <Outlet />
        </Layout>
        <Footer />
        {user?.role !== 'ADMIN' && <ChatbotFloatingButton />}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </div>
    </QueryClientProvider>
  );
}
