'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, FileText, Heart, Users } from 'lucide-react';

export default function PatientDashboard() {
  const [stats, setStats] = useState({
    assessments: 0,
    appointments: 0,
    doctors: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [assessmentsRes, appointmentsRes] = await Promise.all([
        fetch('/api/predictions'),
        fetch('/api/appointments'),
      ]);

      const assessmentsData = await assessmentsRes.json();
      const appointmentsData = await appointmentsRes.json();

      setStats({
        assessments: assessmentsData.data?.length || 0,
        appointments: appointmentsData.data?.length || 0,
        doctors: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const chartData = [
    { name: 'Jan', risk: 30 },
    { name: 'Feb', risk: 35 },
    { name: 'Mar', risk: 28 },
    { name: 'Apr', risk: 25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">Manage your health and medical consultations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-3xl font-bold">{stats.assessments}</p>
              </div>
              <Heart className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Appointments</p>
                <p className="text-3xl font-bold">{stats.appointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick Actions</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => window.location.href = '/dashboard/patient/health-assessment'}>
                  New Assessment
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/dashboard/patient/browse-doctors'}>
                  Find Doctor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Trend</CardTitle>
          <CardDescription>Your liver disease risk assessment trend over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="risk" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/dashboard/patient/appointments'}
            >
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/dashboard/patient/results'}
            >
              View Assessment Results
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
