'use client';

import { FaClipboardList, FaBox, FaCalendarAlt, FaEuroSign, FaImage, FaStar } from 'react-icons/fa';
import { Badge } from "@prodavnica/ui";
import { Card, CardHeader, CardContent } from "@prodavnica/ui";
import Image from 'next/image';
import Link from 'next/link';
import type { Porudzbina } from '@/types';
import RateStavka from './RateStavka';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/i18n/I18nProvider';

interface MojePorudzbineContentProps {
    porudzbine: Porudzbina[];
    total: number;
    page: number;
    pageSize: number;
    userId: string;
}

export default function MojePorudzbineContent({
    porudzbine,
    total,
    page,
    pageSize,
    userId
}: MojePorudzbineContentProps) {
    const { t, language } = useI18n();
    const tr = (key: string) => t('moje_porudzbine', key);
    const totalPages = Math.ceil(total / pageSize);

    if (!porudzbine.length) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center" suppressHydrationWarning>
                        <FaClipboardList className="text-gray-600" />
                        {tr('moje_porudzbine')}
                    </h1>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FaBox className="text-6xl text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2" suppressHydrationWarning>
                            {tr('nemate_porudzbina')}
                        </h2>
                        <p className="text-gray-500 mb-6" suppressHydrationWarning>
                            {tr('kada_napravite_porudzbinu')}
                        </p>
                        <Button asChild size="lg" className="px-8 justify-center w-auto" suppressHydrationWarning>
                            <Link href="/proizvodi" className="flex items-center justify-center">
                                {tr('pocni_kupovinu')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center" suppressHydrationWarning>
                    <FaClipboardList className="text-gray-600" />
                    {tr('moje_porudzbine')}
                </h1>

                <div className="space-y-6">
                    {porudzbine.map((porudzbina: Porudzbina) => (
                        <div key={porudzbina.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <FaClipboardList className="text-gray-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900" suppressHydrationWarning>
                                                {tr('porudzbina')} #{porudzbina.id.slice(-8)}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="text-gray-600" />
                                                    {new Date(porudzbina.kreiran).toLocaleDateString(language === 'en' ? 'en-US' : 'sr-RS')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaEuroSign className="text-gray-600" />
                                                    {porudzbina.ukupno.toFixed(2)} €
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant={porudzbina.status === 'Završeno' ? 'default' : porudzbina.status === 'Na čekanju' ? 'secondary' : porudzbina.status === 'Otkazano' ? 'destructive' : 'outline'}
                                            className="text-sm font-medium"
                                            suppressHydrationWarning
                                        >
                                            {porudzbina.status === 'Završeno'
                                                ? tr('status_zavrseno')
                                                : porudzbina.status === 'Na čekanju'
                                                    ? tr('status_na_cekanju')
                                                    : porudzbina.status === 'Otkazano'
                                                        ? tr('status_otkazano')
                                                        : porudzbina.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Stavke porudžbine */}
                                {porudzbina.stavkePorudzbine && porudzbina.stavkePorudzbine.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3" suppressHydrationWarning>{tr('stavke')}:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {porudzbina.stavkePorudzbine.map((stavka) => (
                                                <Card key={stavka.id}>
                                                    <CardHeader className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                {stavka.slika ? (
                                                                    <Image
                                                                        src={stavka.slika}
                                                                        alt={stavka.proizvod ? (language === 'en' ? stavka.proizvod.naziv_en : stavka.proizvod.naziv_sr) : 'Proizvod'}
                                                                        width={48}
                                                                        height={48}
                                                                        className="w-12 h-12 object-cover rounded-lg"
                                                                    />
                                                                ) : (
                                                                    <FaImage className="text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 line-clamp-2" suppressHydrationWarning>
                                                                    {stavka.proizvod ? (language === 'en' ? stavka.proizvod.naziv_en : stavka.proizvod.naziv_sr) : tr('nepoznat_proizvod')}
                                                                </p>
                                                                <div className="mt-2 bg-gray-100 rounded px-2 py-1">
                                                                    <p className="text-xs text-gray-700 font-semibold">
                                                                        {stavka.kolicina}x • <span className="text-blue-600">{stavka.cena.toFixed(2)} €</span>
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-gray-600 mt-2">
                                                                    {stavka.boja && <span>{stavka.boja}</span>}
                                                                    {stavka.boja && stavka.velicina && <span> • </span>}
                                                                    {stavka.velicina && <span>{stavka.velicina}</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <div className="border-t border-border" />
                                                    <CardContent className="p-3 pt-0">
                                                        {porudzbina.status === 'Završeno' ? (
                                                            <RateStavka
                                                                stavkaId={stavka.id}
                                                                userId={userId}
                                                                initialRating={stavka.rating ?? null}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="group flex items-center gap-2 cursor-not-allowed select-none"
                                                                title={tr('ocena_samo_zavrsene')}
                                                                aria-disabled={true}
                                                                    suppressHydrationWarning
                                                                >
                                                                    <div className="flex items-center gap-1">
                                                                        {[1, 2, 3, 4, 5].map((value) => (
                                                                            <FaStar
                                                                                key={value}
                                                                                className="text-gray-300 transition-colors group-hover:text-gray-400"
                                                                                aria-hidden="true"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                <Badge variant="outline" className="text-xs" suppressHydrationWarning>
                                                                    {tr('ocena_samo_zavrsene')}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginacija */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {page > 1 && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/moje-porudzbine?page=${page - 1}&pageSize=${pageSize}`}>
                                    {tr('prethodna')}
                                </Link>
                            </Button>
                        )}

                        <span className="px-3 py-2 text-sm text-gray-700" suppressHydrationWarning>
                            {tr('stranica')} {page} {tr('od')} {totalPages}
                        </span>

                        {page < totalPages && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/moje-porudzbine?page=${page + 1}&pageSize=${pageSize}`}>
                                    {tr('sledeca')}
                                </Link>
                            </Button>
                        )}
                    </div>
                )}

                {/* Info o ukupnom broju */}
                <div className="mt-4 text-center text-sm text-gray-600" suppressHydrationWarning>
                    {tr('ukupno_porudzbina')}: {total}
                </div>
            </div>
        </div>
    );
}
