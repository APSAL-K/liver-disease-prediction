'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  clinic: { name: string; location: string };
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const doctorId = searchParams.get('doctorId');

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`/api/doctors?doctorId=${doctorId}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setDoctor(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast({ title: 'Error', description: 'Failed to load doctor information' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast({ title: 'Error', description: 'Please select date and time' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor._id,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Appointment booked successfully!' });
        router.push('/dashboard/patient/appointments');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to book appointment' });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({ title: 'Error', description: 'Failed to book appointment' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <p>Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Book Appointment</h1>
        <p className="text-muted-foreground mt-2">Schedule a consultation with our doctor</p>
      </div>

      {/* Doctor Info */}
      <Card>
        <CardHeader>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription>{doctor.specialty}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm"><strong>Clinic:</strong> {doctor.clinic.name}</p>
          <p className="text-sm"><strong>Location:</strong> {doctor.clinic.location}</p>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <Input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time *</label>
                <Input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason for Visit *</label>
              <Input
                name="reason"
                placeholder="e.g., Follow-up consultation"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <Textarea
                name="notes"
                placeholder="Any additional information for the doctor..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
