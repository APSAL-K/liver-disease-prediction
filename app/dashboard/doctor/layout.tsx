import DashboardLayout from '@/components/dashboard-layout';

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout userRole="doctor">{children}</DashboardLayout>;
}
