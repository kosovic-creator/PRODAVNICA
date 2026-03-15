"use server";
import { z } from "zod";
import { prijavaSchema } from "@/lib/validators";

// Server action za validaciju forme
export async function loginAction(
  prevState: { error: string | null; success: boolean; email?: string; lozinka?: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const lozinka = formData.get("lozinka") as string;

  // Stub za t funkciju (zameni po potrebi)
  const t = (_ns: string, key: string) => key;

  try {
    prijavaSchema(t).parse({ email, lozinka });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Greška u validaciji", success: false };
    }
    return { error: "Greška u validaciji", success: false };
  }

  // Ako je validacija prošla, šaljemo podatke za klijentski signIn
  return { error: null, success: true, email, lozinka };
}
