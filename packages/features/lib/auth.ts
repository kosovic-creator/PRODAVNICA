import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
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
  avatar?: string;
  [key: string]: unknown;
}

interface CustomSessionUser {
  id?: string;
  email?: string;
  uloga?: string;
  ime?: string;
  prezime?: string;
}

export interface CreateAuthOptionsParams {
  /**
   * Prisma model za autentifikaciju ('korisnik' ili 'korisnikAdmin')
   */
  userModel: "korisnik" | "korisnikAdmin";

  /**
   * Prisma client instanca
   */
  prisma: PrismaClient;

  /**
   * Da li omogućiti Google OAuth provider
   */
  enableGoogleProvider?: boolean;

  /**
   * NextAuth secret
   */
  secret?: string;

  /**
   * Google OAuth credentials (obavezno ako je enableGoogleProvider true)
   */
  googleClientId?: string;
  googleClientSecret?: string;

  /**
   * Custom sign-in page URL
   */
  signInPage?: string;

  /**
   * Custom error page URL
   */
  errorPage?: string;

  /**
   * Custom sign-out redirect URL
   */
  signOutUrl?: string;

  /**
   * Custom session cookie name (useful in monorepo with multiple NextAuth apps on localhost)
   */
  sessionCookieName?: string;
}

/**
 * Kreira NextAuth konfiguraciju za admin ili klijent aplikaciju
 *
 * @example
 * // Za prodavnica-client (sa Google OAuth)
 * export const authOptions = createAuthOptions({
 *   userModel: 'korisnik',
 *   prisma,
 *   enableGoogleProvider: true,
 *   googleClientId: process.env.GOOGLE_CLIENT_ID,
 *   googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *   secret: process.env.NEXTAUTH_SECRET,
 *   signInPage: '/prijava',
 * });
 *
 * @example
 * // Za prodavnica-admin (samo credentials)
 * export const authOptions = createAuthOptions({
 *   userModel: 'korisnikAdmin',
 *   prisma,
 *   enableGoogleProvider: false,
 *   secret: process.env.NEXTAUTH_SECRET,
 *   signInPage: '/prijava',
 * });
 */
export function createAuthOptions({
  userModel,
  prisma,
  enableGoogleProvider = false,
  secret,
  googleClientId,
  googleClientSecret,
  signInPage = "/prijava",
  errorPage = "/prijava",
  signOutUrl,
  sessionCookieName,
}: CreateAuthOptionsParams): NextAuthOptions {
  const providers: NextAuthOptions["providers"] = [];

  // Google OAuth provider (samo za client)
  if (enableGoogleProvider) {
    if (!googleClientId || !googleClientSecret) {
      throw new Error(
        "Google OAuth credentials are required when enableGoogleProvider is true"
      );
    }
    providers.push(
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    );
  }

  // Credentials provider (za obe aplikacije)
  providers.push(
    CredentialsProvider({
      name: "Email i Lozinka",
      credentials: {
        email: { label: "Email", type: "text" },
        lozinka: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          return null;
        }

        const { email, lozinka } = result.data;

        // @ts-ignore - Prisma type inference problem
        const korisnik = await prisma[userModel].findUnique({
          where: { email },
        });

        if (!korisnik || !korisnik.lozinka) {
          return null;
        }

        const valid = await bcrypt.compare(lozinka, korisnik.lozinka);
        if (!valid) {
          return null;
        }
        return {
          id: korisnik.id,
          email: korisnik.email,
          uloga: korisnik.uloga,
          ime: korisnik.ime,
          prezime: korisnik.prezime,
        };
      },
    })
  );

  const isProduction = process.env.NODE_ENV === "production";

  return {
    secret,
    providers,
    session: {
      strategy: "jwt",
    },
    ...(sessionCookieName
      ? {
        cookies: {
          sessionToken: {
            name: sessionCookieName,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: isProduction,
            },
          },
        },
      }
      : {}),
    callbacks: {
      async signIn({ user, account }) {
        // OAuth sign-in handling (samo za Google provider)
        if (account?.provider === "google" && enableGoogleProvider) {
          try {
            // @ts-ignore - Prisma type inference problem
            const postojeciKorisnik = await prisma[userModel].findUnique({
              where: { email: user.email! },
            });

            if (!postojeciKorisnik) {
              // @ts-ignore - Prisma type inference problem
              await prisma[userModel].create({
                data: {
                  email: user.email!,
                  uloga: userModel === "korisnikAdmin" ? "admin" : "korisnik",
                  lozinka: null,
                },
              });
            }
          } catch (error) {
            console.error("❌ Greška pri čuvanju OAuth korisnika:", error);
            return false;
          }
        }
        return true;
      },

      async jwt({ token, user, account }) {
        if (user) {
          // Credentials provider - direktno iz authorize funkcije
          if (account?.provider === "credentials") {
            const u = user as CustomUser;
            (token as CustomToken).id = u.id;
            (token as CustomToken).email = u.email;
            (token as CustomToken).uloga = u.uloga;
            (token as CustomToken).ime = u.ime;
            (token as CustomToken).prezime = u.prezime;
          } else if (account?.provider === "google" && enableGoogleProvider) {
            // OAuth provider - učitaj podatke iz baze
            // @ts-ignore - Prisma type inference problem
            const korisnikIzBaze = await prisma[userModel].findUnique({
              where: { email: user.email! },
            });

            if (korisnikIzBaze) {
              (token as CustomToken).id = korisnikIzBaze.id;
              (token as CustomToken).email = korisnikIzBaze.email;
              (token as CustomToken).uloga = korisnikIzBaze.uloga;
              (token as CustomToken).ime = korisnikIzBaze.ime;
              (token as CustomToken).prezime = korisnikIzBaze.prezime;
            }
          }
        }
        return token;
      },

      async session({ session, token }) {
        if (token && session.user) {
          (session.user as CustomSessionUser).id = (token as CustomToken).id;
          (session.user as CustomSessionUser).email = (token as CustomToken).email;
          (session.user as CustomSessionUser).uloga = (token as CustomToken).uloga;
          (session.user as CustomSessionUser).ime = (token as CustomToken).ime;
          (session.user as CustomSessionUser).prezime = (token as CustomToken).prezime;
        }
        return session;
      },
    },
    pages: {
      signIn: signInPage,
      error: errorPage,
      ...(signOutUrl && { signOut: signOutUrl }),
    },
  };
}
