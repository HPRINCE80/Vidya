import { Bell, CalendarCheck, CircleDollarSign, LayoutDashboard, UserRound, Users } from 'lucide-react';
import RoleLayout from './RoleLayout.jsx';

const navItems = [
  { label: 'Dashboard', to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Students', to: '/teacher/students', icon: Users },
  { label: 'Attendance', to: '/teacher/attendance', icon: CalendarCheck },
  { label: 'Fees', to: '/teacher/fees', icon: CircleDollarSign },
  { label: 'Notices', to: '/teacher/notices', icon: Bell },
  { label: 'Profile', to: '/teacher/profile', icon: UserRound },
];

const TeacherLayout = () => <RoleLayout roleLabel="Teacher" navItems={navItems} accent="emerald" />;

export default TeacherLayout;
