import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Guide from '@/pages/guide';
import Login from '@/pages/auth/Login';
import Verify from '@/pages/auth/Verify';
import PrivacyAgreement from '@/pages/auth/PrivacyAgreement';
import Signup from '@/pages/auth/Signup';
import PrivateRoute from '@/components/common/PrivateRoute';
import ClassroomLookup from '@/pages/student/ClassroomLookup';
import Reservation from '@/pages/student/Reservation';

import Dashboard from '@/pages/admin/Dashboard';
import ApprovalPage from '@/pages/approval/index';

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
      {
        path: '/verify',
        element: <Verify />,
      },
      {
        path: '/privacy-agreement',
        element: <PrivacyAgreement />,
      },

      {
        path: '/signup',
        element: <Signup />,
      },
      // Student routes
      {
        path: '/student/reservation',
        element: (
          <PrivateRoute role="STUDENT">
            <ClassroomLookup />
          </PrivateRoute>
        ),
      },
      {
        path: '/student/reservation/:classroomId',
        element: (
          <PrivateRoute role="STUDENT">
            <Reservation />
          </PrivateRoute>
        ),
      },
      // Professor routes
      {
        path: '/approval/:reservationId',
        element: <ApprovalPage />,
      },
      // Admin routes
      {
        path: '/admin',
        element: (
          <PrivateRoute role="ADMIN">
            <Dashboard />
          </PrivateRoute>
        ),
      },
        element: (
          </PrivateRoute>
        ),
      },
    ],
  },
]);
