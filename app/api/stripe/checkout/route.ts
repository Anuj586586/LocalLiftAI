import { NextResponse } from 'next/server';
import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2023-10-16' as any // Use a standard API version, '2023-10-16' or latest compatible
    });
  }
  return stripeClient;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRICE_ID;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Configuration Required', details: 'STRIPE_PRICE_ID is missing from your Environment Variables.' },
        { status: 400 }
      );
    }
    
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
    });
    
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    
    if (error.message === 'STRIPE_SECRET_KEY environment variable is required') {
      return NextResponse.json(
        { error: 'Configuration Required', details: 'STRIPE_SECRET_KEY is missing from your Environment Variables. Add it in AI Studio Settings.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
