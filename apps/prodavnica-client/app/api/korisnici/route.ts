'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


export async function GET() {
  try {
    const korisnici = await prisma.korisnik.findMany({
      include: { podaciPreuzimanja: true }
    });
    return new Response(JSON.stringify(korisnici), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju korisnika:', error);
    return new Response(JSON.stringify({ error: 'Greška pri dohvaćanju korisnika.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID korisnika je obavezan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.korisnik.delete({
      where: { id }
    });

    revalidatePath('/admin/korisnici');

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Greška pri brisanju korisnika:', error);
    return new Response(JSON.stringify({ error: 'Greška pri brisanju korisnika.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}