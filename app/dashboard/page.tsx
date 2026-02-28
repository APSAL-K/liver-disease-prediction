'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        router.push('/dashboard/patient');
      } else if (user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      }
    } else {
      router.push('/auth/login');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
