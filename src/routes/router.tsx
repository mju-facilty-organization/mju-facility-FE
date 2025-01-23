import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Guide from '@/pages/guide';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Guide />,
      },
  },
]);
