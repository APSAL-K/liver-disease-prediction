'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Calendar,
  Heart,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'patient' | 'doctor' | 'admin';
}

export default function DashboardLayout({
  children,
  userRole = 'patient',
}: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const patientMenuItems = [
    { label: 'Home', href: '/dashboard/patient', icon: BarChart3 },
    { label: 'Assessment', href: '/dashboard/patient/health-assessment', icon: Heart },
    { label: 'Results', href: '/dashboard/patient/results', icon: BarChart3 },
    { label: 'Find Doctors', href: '/dashboard/patient/browse-doctors', icon: Users },
    { label: 'Appointments', href: '/dashboard/patient/appointments', icon: Calendar },
    { label: 'Settings', href: '/dashboard/patient/settings', icon: Settings },
  ];

  const doctorMenuItems = [
    { label: 'Home', href: '/dashboard/doctor', icon: BarChart3 },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
    { label: 'Patients', href: '/dashboard/doctor/patients', icon: Users },
    { label: 'Profile', href: '/dashboard/doctor/profile', icon: Settings },
  ];

  const adminMenuItems = [
    { label: 'Overview', href: '/dashboard/admin', icon: BarChart3 },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Doctors', href: '/dashboard/admin/doctors', icon: Users },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const menuItems =
    userRole === 'doctor'
      ? doctorMenuItems
      : userRole === 'admin'
        ? adminMenuItems
        : patientMenuItems;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:relative md:translate-x-0 transition-transform z-40 w-64 border-r border-border bg-background h-full flex flex-col`}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-bold">Liver Disease Prediction</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-background px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <p className="text-sm text-muted-foreground">Welcome</p>
              <p className="font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {userRole} Dashboard
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
