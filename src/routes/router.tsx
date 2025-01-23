import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Guide from '@/pages/guide';
import Login from '@/pages/auth/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Guide />,
      },
      {
        path: '/login',
        element: <Login />,
      },
  },
]);
