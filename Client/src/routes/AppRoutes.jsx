import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import StudentLayout from '../layouts/StudentLayout.jsx';
import TeacherLayout from '../layouts/TeacherLayout.jsx';
import RoleFeaturePage from '../pages/common/RoleFeaturePage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import RegisterRoleSelectPage from '../pages/auth/RegisterRoleSelectPage.jsx';
import RoleRegisterPage from '../pages/auth/RoleRegisterPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminTeachersPage from '../pages/admin/AdminTeachersPage.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import StudentAttendancePage from '../pages/student/StudentAttendancePage.jsx';
import StudentDashboardPage from '../pages/student/StudentDashboardPage.jsx';
import StudentFeesPage from '../pages/student/StudentFeesPage.jsx';
import StudentNoticesPage from '../pages/student/StudentNoticesPage.jsx';
import StudentProfilePage from '../pages/student/StudentProfilePage.jsx';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage.jsx';
import AdminRoute from './AdminRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import StudentRoute from './StudentRoute.jsx';
import TeacherRoute from './TeacherRoute.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterRoleSelectPage />} />
          <Route path="/register/student" element={<RegisterPage />} />
          <Route path="/register/teacher" element={<RoleRegisterPage role="teacher" />} />
          <Route path="/register/admin" element={<RoleRegisterPage role="admin" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/student" replace />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/attendance" element={<DashboardPage />} />
          <Route path="/admin/classes" element={<DashboardPage />} />
          <Route path="/admin/students" element={<RoleFeaturePage title="Students" description="Review student accounts and class membership." />} />
          <Route path="/admin/teachers" element={<AdminTeachersPage />} />
          <Route path="/admin/fees" element={<RoleFeaturePage title="Fees" description="Manage fee records and payment status." />} />
          <Route path="/admin/notices" element={<RoleFeaturePage title="Notices" description="Publish announcements for your school community." />} />
          <Route path="/admin/reports" element={<RoleFeaturePage title="Reports" description="System-wide reporting will appear here as reporting endpoints are added." />} />
          <Route path="/admin/settings" element={<RoleFeaturePage title="Settings" description="Configure school-wide preferences." />} />
        </Route>
      </Route>

      <Route element={<TeacherRoute />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="/teacher/attendance" element={<DashboardPage />} />
          <Route path="/teacher/students" element={<DashboardPage />} />
          <Route path="/teacher/fees" element={<RoleFeaturePage title="Fees" description="View fee information available to your assigned students." />} />
          <Route path="/teacher/notices" element={<RoleFeaturePage title="Notices" description="Read school announcements." />} />
          <Route path="/teacher/profile" element={<RoleFeaturePage title="Profile" description="Review your teacher account details." />} />
        </Route>
      </Route>

      <Route element={<StudentRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/attendance" element={<StudentAttendancePage />} />
          <Route path="/student/fees" element={<StudentFeesPage />} />
          <Route path="/student/notices" element={<StudentNoticesPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
