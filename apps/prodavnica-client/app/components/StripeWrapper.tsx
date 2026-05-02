'use client';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripeConfig } from '../config/stripe';

const stripePromise = loadStripe(stripeConfig.publishableKey);

export default function StripeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
