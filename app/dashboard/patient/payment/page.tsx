'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Appointment {
  _id: string;
  doctorId: { name: string };
  appointmentDate: string;
  appointmentTime: string;
}

const CONSULTATION_FEE = 50; // USD

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const appointmentId = searchParams.get('appointmentId');

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments?appointmentId=${appointmentId}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setAppointment(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!appointment) return;

    try {
      setProcessing(true);
      
      // Create payment intent
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment._id,
          amount: CONSULTATION_FEE,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // In a real app, you would integrate with Stripe Checkout
        // For now, simulate successful payment
        setTimeout(async () => {
          await fetch('/api/payments', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: data.paymentId,
              status: 'completed',
            }),
          });
          
          setPaymentStatus('completed');
          toast({ title: 'Success', description: 'Payment completed successfully!' });
          
          setTimeout(() => {
            router.push('/dashboard/patient/appointments');
          }, 2000);
        }, 2000);
      } else {
        setPaymentStatus('failed');
        toast({ title: 'Error', description: data.error || 'Payment failed' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('failed');
      toast({ title: 'Error', description: 'Failed to process payment' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!appointment) {
    return (
      <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <p>Appointment not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Complete Payment</h1>
        <p className="text-muted-foreground mt-2">Secure payment for your consultation</p>
      </div>

      {/* Appointment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Doctor:</span>
            <span className="font-medium">{appointment.doctorId.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date & Time:</span>
            <span className="font-medium">
              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-muted-foreground">Consultation Fee:</span>
            <span className="font-bold text-lg">${CONSULTATION_FEE.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      {paymentStatus === 'completed' && (
        <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Payment Successful!</p>
            <p className="text-sm">Your appointment is confirmed. Redirecting...</p>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>Payment failed. Please try again.</p>
        </div>
      )}

      {/* Payment Button */}
      {paymentStatus === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              We accept all major credit cards via Stripe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Card Details</p>
              <div className="text-sm font-mono">
                4242 4242 4242 4242
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                (Demo card - use any future expiry date and CVC)
              </p>
            </div>
            
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? 'Processing...' : `Pay $${CONSULTATION_FEE.toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
