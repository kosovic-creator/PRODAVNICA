import { NextResponse } from 'next/server';
import { registrujKorisnika } from '@/lib/actions';
import { registracijaSchema } from '@/zod';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate data with Zod schema
    const validationResult = registracijaSchema.safeParse(data);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        errors[String(err.path[0])] = err.message;
      }

      return NextResponse.json({
        success: false,
        error: 'Validacijska greška',
        errors: errors
      }, { status: 400 });
    }

    // If validation passes, proceed with registration
    const result = await registrujKorisnika(validationResult.data);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Greška pri registraciji:', error);
    return NextResponse.json({
      success: false,
      error: 'Došlo je do greške na serveru'
    }, { status: 500 });
  }
}

