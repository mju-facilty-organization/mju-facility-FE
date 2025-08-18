import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
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
        <Layout className="flex-1">
          <Outlet />
        </Layout>
        <Footer />
        {user?.role !== 'ADMIN' && <ChatbotFloatingButton />}
      </div>
    </QueryClientProvider>
  );
}
