/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const korisnik = await prisma.korisnik.findUnique({
      where: { id },
      include: { podaciPreuzimanja: true }
    });

    if (!korisnik) {
      return NextResponse.json(
        { success: false, error: 'Korisnik nije pronađen' },
        { status: 404 }
      );
    }

    // Serialize korisnik to ensure it's JSON-safe
    const serializedKorisnik = JSON.parse(JSON.stringify(korisnik));

    return NextResponse.json(
      { success: true, data: serializedKorisnik },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching korisnik:', error);
    return NextResponse.json(
      { success: false, error: 'Greška pri dohvaćanju korisnika' },
      { status: 500 }
    );
  }
}
export async function deleteKorisnikById(id: string) {
  try {
    await prisma.korisnik.delete({
      where: { id }
    });

    revalidatePath('/admin/korisnici');

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting korisnik:', error);
    return {
      success: false,
      error: 'Greška pri brisanju korisnika'
    };
  }
}

export async function POST( request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
        if (!id) {
          return new Response(JSON.stringify({ error: 'ID korisnika je obavezan.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        // Add your POST logic here, or close the function if not needed
        return new Response(JSON.stringify({ success: false, error: 'POST logic not implemented.' }), {
          status: 501,
          headers: { 'Content-Type': 'application/json' }
        });
    }