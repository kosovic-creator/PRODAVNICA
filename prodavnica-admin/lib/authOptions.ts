import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  lozinka: z.string().min(6),
});

interface CustomUser {
  id: string;
  email: string;
  uloga?: string;
  ime?: string;
  prezime?: string;
}

interface CustomToken {
  id?: string;
  email?: string;
  uloga?: string;
  ime?: string;
  prezime?: string;
  [key: string]: unknown;
}

interface CustomSessionUser {
  id?: string;
  email?: string;
  uloga?: string;
  ime?: string;
  prezime?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [

    CredentialsProvider({
      name: "Email i Lozinka",
      credentials: {
        email: { label: "Email", type: "text" },
        lozinka: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        console.log('🔐 Authorize pokušaj:', credentials?.email);
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          console.log('❌ Validacija nije uspela:', result.error);
          return null;
        }
        const { email, lozinka } = result.data;
        const korisnik = await prisma.korisnikAdmin.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            lozinka: true,
            uloga: true,
            ime: true,
            prezime: true,
          },
        });
        if (!korisnik) {
          console.log('❌ Korisnik ne postoji:', email);
          return null;
        }
        if (!korisnik.lozinka) {
          console.log('❌ Korisnik nema lozinku (OAuth):', email);
          return null;
        }
        const valid = await bcrypt.compare(lozinka, korisnik.lozinka);
        if (!valid) {
          console.log('❌ Pogrešna lozinka za:', email);
          return null;
        }
        console.log('✅ Uspešna prijava:', email);
        return {
          id: korisnik.id,
          email: korisnik.email,
          uloga: korisnik.uloga,
          ime: korisnik.ime,
          prezime: korisnik.prezime,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as CustomUser;
        (token as CustomToken).id = u.id;
        (token as CustomToken).uloga = u.uloga;
        (token as CustomToken).ime = u.ime;
        (token as CustomToken).prezime = u.prezime;
      }
      return token;
    },
    async session({ session, token }) {
      // Dodajemo polje uloga iz tokena u session.user
      if (token && session.user) {
        (session.user as CustomSessionUser).uloga = (token as CustomToken).uloga;
        (session.user as CustomSessionUser).ime = (token as CustomToken).ime;
        (session.user as CustomSessionUser).prezime = (token as CustomToken).prezime;
        (session.user as CustomSessionUser).id = (token as CustomToken).id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/prijava",
    error: "/prijava",
    signOut: process.env.NEXT_PUBLIC_BASE_URL + "/prijava",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
