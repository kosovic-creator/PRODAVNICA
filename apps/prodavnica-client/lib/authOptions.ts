import { createAuthOptions } from "../../../packages/features";
import prisma from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const enableGoogleProvider = Boolean(googleClientId && googleClientSecret);

export const authOptions = createAuthOptions({
  userModel: "korisnik",
  prisma,
  enableGoogleProvider,
  googleClientId,
  googleClientSecret,
  secret: process.env.NEXTAUTH_SECRET,
  sessionCookieName: "prodavnica-client.session-token",
  signInPage: "/prijava",
  errorPage: "/prijava",
});
