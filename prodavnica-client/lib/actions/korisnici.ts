'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { UpdateKorisnikData } from '@/types';

export async function getKorisnikById(id: string) {
  try {
    const korisnik = await prisma.korisnik.findUnique({
      where: { id },
      include: { podaciPreuzimanja: true }
    });

    if (!korisnik) {
      return {
        success: false,
        error: 'Korisnik nije pronađen'
      };
    }

    return {
      success: true,
      data: korisnik
    };
  } catch (error) {
    console.error('Error fetching korisnik:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju korisnika'
    };
  }
}

export async function createKorisnik(data: {
  email?: string;
  lozinka?: string;
}) {
  try {
    let { email, lozinka } = data;

    console.log('🔵 Input data:', { email: email || 'EMPTY', lozinka: lozinka ? '***' : 'EMPTY' });

    // Sanitize and validate
    if (!email || typeof email !== 'string') {
      console.error('❌ Invalid email type:', typeof email);
      throw new Error('Email mora biti validan string');
    }

    if (!lozinka || typeof lozinka !== 'string') {
      console.error('❌ Invalid lozinka type:', typeof lozinka);
      throw new Error('Lozinka mora biti validan string');
    }

    email = email.trim().toLowerCase();

    if (!email || email.length === 0) {
      throw new Error('Email ne sme biti prazan nakon sanitizacije');
    }

    if (lozinka.length === 0) {
      throw new Error('Lozinka ne sme biti prazna');
    }

    // Provjera da li već postoji korisnik sa tim emailom
    const existing = await prisma.korisnik.findUnique({ where: { email } });
    if (existing) {
      return {
        success: false,
        error: 'email_exists'
      };
    }

    // Hash lozinke prije upisa
    let hash: string;
    try {
      hash = await bcrypt.hash(lozinka, 10);
      if (!hash || typeof hash !== 'string' || hash.length === 0) {
        throw new Error('Hash je invalid nakon hešovanja');
      }
    } catch (hashError) {
      console.error('❌ Hashing failed:', hashError);
      throw new Error('Greška pri hešovanju lozinke');
    }

    // Type-safe data object - bez eksplicitnih timestamp-a jer schema ima defaults
    const createData = {
      id: randomUUID(),
      email: email as string,
      lozinka: hash as string,
      uloga: 'korisnik',
    };

    const korisnik = await prisma.korisnik.create({
      data: createData
    });

    revalidatePath('/registracija');

    return {
      success: true,
      data: korisnik,
      redirect: `/prijava?success=true`
    };
  } catch (error) {
    console.error('❌ Error creating korisnik:', error);
    // Specifična poruka za unique constraint
    if (error instanceof Error && typeof (error as { code?: string }).code === 'string' && (error as { code?: string }).code === 'P2002') {
      return {
        success: false,
        error: 'email_exists'
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Greška pri kreiranju korisnika'
    };
  }
}

export async function updateKorisnik(data: UpdateKorisnikData) {
  try {
    const { id, email, lozinka } = data;

    // Prepare update data
    const updateData: { email?: string; lozinka?: string } = {};

    if (email) {
      updateData.email = email;
    }

    if (lozinka) {
      const hash = await bcrypt.hash(lozinka, 10);
      updateData.lozinka = hash;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: 'Nema podataka za ažuriranje'
      };
    }

    const korisnik = await prisma.korisnik.update({
      where: { id },
      data: updateData
    });

    console.log('✅ Korisnik updated:', id);

    revalidatePath('/profil');

    return {
      success: true,
      data: korisnik
    };
  } catch (error) {
    console.error('❌ Error updating korisnik:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Greška pri ažuriranju korisnika'
    };
  }
}

export async function deleteKorisnik(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'ID je obavezan.'
      };
    }

    // Check if user exists
    const existingKorisnik = await prisma.korisnik.findUnique({
      where: { id }
    });

    if (!existingKorisnik) {
      return {
        success: false,
        error: 'Korisnik nije pronađen'
      };
    }

    // Delete related data first using transaction
    await prisma.$transaction(async (tx) => {
      // Delete cart items
      await tx.stavkaKorpe.deleteMany({
        where: { korisnikId: id }
      });

      // Delete favorites
      await tx.omiljeni.deleteMany({
        where: { korisnikId: id }
      });

      // Delete delivery data
      await tx.podaciPreuzimanja.deleteMany({
        where: { korisnikId: id }
      });

      // Finally delete the user (porudžbine će ostati sa strim korisnikId)
      await tx.korisnik.delete({
        where: { id }
      });
    });

    revalidatePath('/profil');

    return {
      success: true,
      message: 'Korisnik je uspešno obrisan'
    };
  } catch (error) {
    console.error('Error deleting korisnik:', error);
    return {
      success: false,
      error: 'Greška pri brisanju korisnika'
    };
  }
}
