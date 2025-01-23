import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
}
