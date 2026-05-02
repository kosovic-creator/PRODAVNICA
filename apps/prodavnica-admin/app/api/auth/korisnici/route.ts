import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registracijaSchema = z.object({
  email: z.string().email("Neispravan email format"),
  lozinka: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
  ime: z.string().min(1, "Ime je obavezno"),
  prezime: z.string().min(1, "Prezime je obavezno"),
  uloga: z.string().optional().default("admin"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validacija podataka
    const validacija = registracijaSchema.safeParse(body);
    if (!validacija.success) {
      return NextResponse.json(
        { success: false, error: "validation_error", details: validacija.error.issues },
        { status: 400 }
      );
    }

    const { email, lozinka, ime, prezime, uloga } = validacija.data;

    // Proveravamo da li korisnik već postoji
    const postojeciKorisnik = await prisma.korisnikAdmin.findUnique({
      where: { email },
    });

    if (postojeciKorisnik) {
      return NextResponse.json(
        { success: false, error: "email_exists", message: "Korisnik sa ovim emailom već postoji" },
        { status: 400 }
      );
    }

    // Hashujemo lozinku
    const hashovanaLozinka = await bcrypt.hash(lozinka, 10);

    // Kreiramo novog korisnika
    const noviKorisnik = await prisma.korisnikAdmin.create({
      data: {
        email,
        lozinka: hashovanaLozinka,
        ime,
        prezime,
        uloga,
      },
      select: {
        id: true,
        email: true,
        ime: true,
        prezime: true,
        uloga: true,
        kreiran: true,
      },
    });

    return NextResponse.json(
      {
        success: true, // Dodaj ovu liniju
        message: "Korisnik uspešno kreiran",
        korisnik: noviKorisnik
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Greška pri registraciji:", error);
    return NextResponse.json(
      { success: false, error: "server_error", message: "Greška na serveru pri registraciji korisnika" },
      { status: 500 }
    );
  }
}