'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, logout } from '@/lib/redux-store';
import { cacheStorage } from '@/lib/cache-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoggedIn && !cacheStorage.getToken()) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    dispatch(logout());
    cacheStorage.clear();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome, {user.fullName}!</CardTitle>
            <CardDescription>Liver Disease Prediction System</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Take a health assessment to get AI-powered predictions.
              </p>
              <Button className="w-full">Start Assessment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Process payments securely with Stripe.
              </p>
              <Link href="/payment">
                <Button className="w-full">Make Payment</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your account settings and preferences.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Redux State Display */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Redux State</CardTitle>
            <CardDescription>Current application state from Redux store</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(
                {
                  auth: { user, isLoggedIn },
                  cached_user: cacheStorage.getUser(),
                },
                null,
                2
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
