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

import Suggestions from '@/pages/suggestion/index';
import SuggestionFormPage from '@/pages/suggestion/suggestionForm';

import AdminReservations from '@/pages/admin/AdminReservations';
import AdminFacilities from '@/pages/admin/AdminFacilities';
import AdminFacilityCreate from '@/pages/admin/AdminFacilityCreate';
import FacilityInUsePage from '@/pages/admin/AdminFacilityInuse';
import ApprovalPage from '@/pages/approval/index';
import AdminRegularSchedule from '@/pages/admin/AdminRegularSchedule';
import AdminFacilitySchedule from '@/pages/admin/AdminFacilitySchedule.tsx';

import CreateNoticePage from '@/pages/admin/AdminNotice';
import NoticeDetailPage from '@/pages/notice/NoticeDetail';
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

      {
        path: '/notice/:noticeId',
        element: <NoticeDetailPage />,
      },
      // Student routes
      {
        path: '/reservation',
        element: <ClassroomLookup />,
      },
      {
        path: '/reservation/:facilityId',
        element: <Reservation />,
      },
      {
        path: '/my-reservations',
        element: (
          <PrivateRoute role="STUDENT">
            <StudentReservationHistory />
          </PrivateRoute>
        ),
      },

      {
        path: '/suggestions',
        element: <Suggestions />,
      },
      {
        path: '/suggestions/create',
        element: <SuggestionFormPage />,
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
      {
        path: '/admin/facilities/create',
        element: (
          <PrivateRoute role="ADMIN">
            <AdminFacilityCreate />
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/facilities/:facilityId/in-use',
        element: (
          <PrivateRoute role="ADMIN">
            <FacilityInUsePage />
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/schedules',
        element: (
          <PrivateRoute role="ADMIN">
            <AdminFacilitySchedule />
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/schedules/regular',
        element: (
          <PrivateRoute role="ADMIN">
            <AdminRegularSchedule />
          </PrivateRoute>
        ),
      },
      {
        path: '/admin/notice',
        element: (
          <PrivateRoute role="ADMIN">
            <CreateNoticePage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
