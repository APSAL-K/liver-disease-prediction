'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  _id: string;
  patientId: { name: string; email: string; phone: string };
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

export default function DoctorAppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Appointment status updated' });
        fetchAppointments();
      } else {
        toast({ title: 'Error', description: 'Failed to update appointment' });
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({ title: 'Error', description: 'Failed to update appointment' });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Appointments</h1>
        <p className="text-muted-foreground mt-2">Manage patient consultations and appointments</p>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No appointments scheduled yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => {
            const aptDate = new Date(apt.appointmentDate);
            return (
              <Card key={apt._id}>
                <CardContent className="py-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Patient</p>
                      <p className="font-semibold">{apt.patientId.name}</p>
                      <p className="text-sm text-muted-foreground">{apt.patientId.email}</p>
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

                    {/* Status */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status</p>
                      <div className={`inline-block px-3 py-1 rounded border ${statusColors[apt.status]}`}>
                        <span className="text-sm font-medium">{apt.status}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {apt.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(apt._id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(apt._id, 'cancelled')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(apt._id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
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
