"use client";

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from "@prodavnica/ui";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';

type StripeCheckoutFormProps = {
    amountInCents: number;
    onSuccess?: () => Promise<void> | void;
    disabled?: boolean;
};

export default function StripeCheckoutForm({ amountInCents, onSuccess, disabled }: StripeCheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { lang } = useLanguage();
    const t = getNamespace(lang, 'placanje');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error(t.payment_not_ready || 'Plaćanje nije spremno. Pokušajte ponovo.');
            return;
        }

        if (disabled) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountInCents }),
            });

            const data = await response.json();

            if (!response.ok || !data?.clientSecret) {
                throw new Error(data?.error || t.failed_create_payment || 'Neuspelo kreiranje plaćanja');
            }

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });

            if (result.error) {
                setError(result.error.message || t.payment_error || 'Greška pri plaćanju');
                return;
            }

            if (result.paymentIntent?.status === 'succeeded') {
                toast.success(t.payment_success || 'Plaćanje uspešno');
                if (onSuccess) {
                    await onSuccess();
                }
            } else {
                setError(t.payment_not_confirmed || 'Plaćanje nije potvrđeno.');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : (t.processing_error || 'Greška pri obradi plaćanja');
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4 bg-white shadow-sm">
            <div className="text-sm text-gray-700 font-medium">{t.card_payment || 'Plaćanje karticom'}</div>
            <div className="rounded-md border p-3 bg-gray-50">
                <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button
                type="submit"
                disabled={!stripe || loading || disabled}
                className="w-full"
            >
                {loading ? (t.processing || 'Obrada...') : `${t.pay_amount || 'Plati'} ${(amountInCents / 100).toFixed(2)} €`}
            </Button>
        </form>
    );
}
