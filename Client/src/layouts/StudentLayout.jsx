import { Bell, CalendarCheck, CircleDollarSign, LayoutDashboard, UserRound } from 'lucide-react';
import RoleLayout from './RoleLayout.jsx';

const navItems = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Attendance', to: '/student/attendance', icon: CalendarCheck },
  { label: 'My Fees', to: '/student/fees', icon: CircleDollarSign },
  { label: 'Notices', to: '/student/notices', icon: Bell },
  { label: 'Profile', to: '/student/profile', icon: UserRound },
];

const StudentLayout = () => <RoleLayout roleLabel="Student" navItems={navItems} accent="sky" />;

export default StudentLayout;
