import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import App from '@/App';
import Guide from '@/pages/guide';
import Login from '@/pages/auth/Login';
import Verify from '@/pages/auth/Verify';
import PrivacyAgreement from '@/pages/auth/PrivacyAgreement';
import Signup from '@/pages/auth/Signup';
import PrivateRoute from '@/components/common/PrivateRoute';

import ClassroomLookup from '@/pages/student/ClassroomLookup';
import Reservation from '@/pages/student/Reservation';
import StudentReservationHistory from '@/pages/student/StudentReservationHistory';

import AdminReservations from '@/pages/admin/AdminReservations';
import AdminFacilities from '@/pages/admin/AdminFacilities';

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
        path: '/student/reservation/:facilityId',
        element: (
          <PrivateRoute role="STUDENT">
            <Reservation />
          </PrivateRoute>
        ),
      },
      {
        path: '/student/my-reservations',
        element: (
          <PrivateRoute role="STUDENT">
            <StudentReservationHistory />
          </PrivateRoute>
        ),
      },
      // Professor routes
      {
        path: '/approval/professor/:professorApprovalId',
        element: <ApprovalPage />,
      },
      // Admin routes
      {
        path: '/admin',
        element: (
          <PrivateRoute role="ADMIN">
            <Navigate to="/admin/facilities" replace />
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/reservations',
        element: (
          <PrivateRoute role="ADMIN">
            <AdminReservations />
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/facilities',
        element: (
          <PrivateRoute role="ADMIN">
            <AdminFacilities />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
