'use client';

import { useRef, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";
import { Checkbox } from "@prodavnica/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@prodavnica/ui";
import { useActionState } from 'react';
import { loginAction } from './loginAction';
import { useI18n } from '@/i18n/I18nProvider';

interface PrijavaFormProps {
    savedEmail: string;
    onRememberMe: (email: string) => Promise<void>;
}

export default function PrijavaForm({ savedEmail, onRememberMe }: PrijavaFormProps) {
    // DEBUG: Log render and state
    console.log('[PrijavaForm] render', { savedEmail });

    const formRef = useRef<HTMLFormElement>(null);
    const { t: i18nT } = useI18n();
    const t = (key: string) => i18nT('auth', `login.${key}`);
    const tLogin = {
        title: t('title') || 'Prijava',
        noAccount: t('noAccount') || 'Nemate nalog?',
        registerHere: t('registerHere') || 'Registrujte se',
    };
    const [state, formAction, pending] = useActionState(loginAction, { error: null, success: false, email: '', lozinka: '' });
    const [rememberMe, setRememberMe] = useState(!!savedEmail);
    const [email, setEmail] = useState(savedEmail || '');

    // DEBUG: Log state changes
    useEffect(() => {
        console.log('[PrijavaForm] state', { state, rememberMe, email });
    }, [state, rememberMe, email]);

    useEffect(() => {
        console.log('[PrijavaForm] mounted');
        return () => console.log('[PrijavaForm] unmounted');
    }, []);

    useEffect(() => {
        if (state.success && state.email && state.lozinka) {
            signIn('credentials', {
                email: state.email,
                lozinka: state.lozinka,
                redirect: true,
                callbackUrl: '/'
            });
        }
    }, [state.success, state.email, state.lozinka]);

    // (Nema automatskog sync-a cookie-ja, poziva se samo iz handlera)

    const handleRememberMeChange = (checked: boolean) => {
        setRememberMe(checked);
        if (checked) {
            onRememberMe(email);
        } else {
            onRememberMe('');
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (rememberMe) {
            onRememberMe(newEmail);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                <Card>
                    <CardHeader className="text-center mb-2 flex flex-col items-center" suppressHydrationWarning>
                        <CardTitle className="text-2xl font-bold" suppressHydrationWarning>
                            {tLogin.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} action={formAction} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t('emailPlaceholder') || 'ime@primer.com'}
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>
                            {/* Password Input */}
                            <div className="space-y-1">
                                <Label htmlFor="lozinka" suppressHydrationWarning>{t('password') || 'Lozinka'}</Label>
                                <Input
                                    id="lozinka"
                                    name="lozinka"
                                    type="password"
                                    placeholder={t('passwordPlaceholder') || '••••••••'}
                                />
                            </div>
                            {/* Remember Me Checkbox */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={handleRememberMeChange}
                                />
                                <Label htmlFor="rememberMe" className="text-sm cursor-pointer" suppressHydrationWarning>
                                    {t('rememberMe') || 'Zapamti me'}
                                </Label>
                            </div>
                            {/* Error Message */}
                            {state?.error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                    {state.error}
                                </div>
                            )}
                            {/* Submit Button */}
                            <Button type="submit" disabled={pending} className="w-full font-medium" suppressHydrationWarning>
                                {pending ? t('submitting') || 'Prijavi se' : t('submit') || 'Prijavi se'}
                            </Button>
                            {/* Separator */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground" suppressHydrationWarning>
                                        {t('orContinueWith') || 'Ili nastavite sa'}
                                    </span>
                                </div>
                            </div>
                            {/* Google Sign In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center"
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span suppressHydrationWarning>{t('loginWithGoogle') || 'Prijavite se sa Google'}</span>
                            </Button>
                        </form>
                        {/* Link ka registraciji */}
                        <div className="text-center mt-4">
                            <p className="text-sm" suppressHydrationWarning>
                                {tLogin.noAccount}{' '}
                                <Link
                                    href="/registracija"
                                    className="text-primary hover:underline font-medium transition-colors hover:text-blue-600"
                                >
                                    {tLogin.registerHere}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
