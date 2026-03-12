import { createAuthOptions } from "@prodavnica/lib";
import prisma from "@/lib/prisma";

export const authOptions = createAuthOptions({
  userModel: "korisnikAdmin",
  prisma,
  enableGoogleProvider: false,
  secret: process.env.NEXTAUTH_SECRET,
  sessionCookieName: "prodavnica-admin.session-token",
  signInPage: "/prijava",
  errorPage: "/prijava",
  signOutUrl: process.env.NEXT_PUBLIC_BASE_URL + "/prijava",
});
