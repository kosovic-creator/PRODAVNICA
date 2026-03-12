import { createAuthOptions } from "@prodavnica/lib";
import prisma from "@/lib/prisma";

export const authOptions = createAuthOptions({
  userModel: "korisnik",
  prisma,
  enableGoogleProvider: true,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  secret: process.env.NEXTAUTH_SECRET,
  sessionCookieName: "prodavnica-client.session-token",
  signInPage: "/prijava",
  errorPage: "/prijava",
});
