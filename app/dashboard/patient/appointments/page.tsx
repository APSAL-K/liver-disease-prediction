'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, CheckCircle, XCircle, Loader } from 'lucide-react';

interface Appointment {
  _id: string;
  doctorId: { name: string; specialty: string };
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons: Record<string, any> = {
  scheduled: Loader,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({ title: 'Error', description: 'Failed to load appointments' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status: 'cancelled' }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Appointment cancelled' });
        fetchAppointments();
      } else {
        toast({ title: 'Error', description: 'Failed to cancel appointment' });
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({ title: 'Error', description: 'Failed to cancel appointment' });
    }
  };

  const handlePayment = (appointmentId: string) => {
    window.location.href = `/dashboard/patient/payment?appointmentId=${appointmentId}`;
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const now = new Date();
    
    if (filter === 'upcoming') return aptDate >= now;
    if (filter === 'past') return aptDate < now;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
        <p className="text-muted-foreground mt-2">Manage and track your medical consultations</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'past'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No appointments found</p>
            <Button onClick={() => window.location.href = '/dashboard/patient/browse-doctors'}>
              Browse Doctors
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(apt => {
            const StatusIcon = statusIcons[apt.status];
            const aptDate = new Date(apt.appointmentDate);
            const isUpcoming = aptDate >= new Date();
            
            return (
              <Card key={apt._id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Doctor Info */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                      <p className="font-semibold">{apt.doctorId.name}</p>
                      <p className="text-sm text-muted-foreground">{apt.doctorId.specialty}</p>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">{aptDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">{apt.appointmentTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm">{apt.reason}</span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded border ${statusColors[apt.status]}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {apt.status === 'scheduled' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handlePayment(apt._id)}
                            >
                              Pay Now
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelAppointment(apt._id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && !isUpcoming && (
                          <Button size="sm" variant="outline">
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
