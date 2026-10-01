import { BarChart3, Bell, BookOpen, CalendarCheck, CircleDollarSign, LayoutDashboard, Settings, Users } from 'lucide-react';
import RoleLayout from './RoleLayout.jsx';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/admin/students', icon: Users },
  { label: 'Teachers', to: '/admin/teachers', icon: Users },
  { label: 'Classes', to: '/admin/classes', icon: BookOpen },
  { label: 'Attendance', to: '/admin/attendance', icon: CalendarCheck },
  { label: 'Fees', to: '/admin/fees', icon: CircleDollarSign },
  { label: 'Notices', to: '/admin/notices', icon: Bell },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const AdminLayout = () => <RoleLayout roleLabel="Admin" navItems={navItems} accent="violet" />;

export default AdminLayout;
