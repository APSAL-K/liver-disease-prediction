'use client';

import React, { useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/payment-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function PaymentPage() {
  const dispatch = useDispatch();
  const [amount] = React.useState(9999); // $99.99 in cents

  const options = useMemo(
    () => ({
      clientSecret: '', // In production, fetch this from your backend
    }),
    []
  );

  const handlePaymentSuccess = (paymentIntentId: string) => {
    toast.success('Payment successful!');
    console.log('[v0] Payment intent:', paymentIntentId);
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    console.log('[v0] Payment error:', error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Payment</h1>
        <p className="text-center text-muted-foreground mb-8">
          Complete your consultation payment securely
        </p>

        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>

        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Test Card Numbers:</p>
          <ul className="space-y-1">
            <li>4242 4242 4242 4242 - Success</li>
            <li>4000 0000 0000 0002 - Decline</li>
            <li>Any future date for expiry</li>
            <li>Any 3-digit CVC</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
