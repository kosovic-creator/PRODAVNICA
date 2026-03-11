import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// Leave apiVersion unspecified to use Stripe SDK default and avoid invalid version errors
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe nije konfigurisan' }, { status: 500 });
    }

    const body = await request.json();
    const amount = typeof body?.amount === 'number' ? Math.round(body.amount) : 0;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('[Stripe][CreatePaymentIntent] error', error);
    return NextResponse.json({ error: 'Unable to create payment intent' }, { status: 500 });
  }
}
