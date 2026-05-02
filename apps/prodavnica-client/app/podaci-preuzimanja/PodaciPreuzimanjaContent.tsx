/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useActionState } from "react";
import { Button, Input } from "@prodavnica/ui";
import SuccessRedirect from "./SuccessRedirect";
import { z } from "zod";
import { createPodaciPreuzimanja, updatePodaciPreuzimanja, getPodaciPreuzimanja } from "@/lib/actions/podaci-preuzimanja";
import { ocistiKorpu } from "@/lib/actions/korpa";

interface Props {
  t: any;
  podaci: any;
  userId: string;
  lang: string;
}

function isFieldErrors(error: Record<string, string[]> | { global?: string }): error is Record<string, string[]> {
  return !("global" in error);
}

export default function PodaciPreuzimanjaContent({ t, podaci, userId }: Props) {
  const [formState, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const podaciSchema = z.object({
      ime: z.string().min(2, t.ime_error || "Ime je obavezno"),
      prezime: z.string().min(2, t.prezime_error || "Prezime je obavezno"),
      adresa: z.string().min(2, t.adresa_error || "Adresa je obavezna"),
      drzava: z.string().min(2, t.drzava_error || "Država je obavezna"),
      grad: z.string().min(2, t.grad_error || "Grad je obavezan"),
      postanskiBroj: z.string().min(2, t.postanskiBroj_error || "Poštanski broj je obavezan"),
      telefon: z.string().min(5, t.telefon_error || "Telefon je obavezan").max(20).regex(/^\+?[0-9\s]*$/, t.telefon_error || "Telefon nije validan"),
    });
    const values = {
      ime: formData.get("ime")?.toString() || "",
      prezime: formData.get("prezime")?.toString() || "",
      adresa: formData.get("adresa")?.toString() || "",
      drzava: formData.get("drzava")?.toString() || "",
      grad: formData.get("grad")?.toString() || "",
      postanskiBroj: formData.get("postanskiBroj")?.toString() || "",
      telefon: formData.get("telefon")?.toString() || "",
    };
    const parsed = podaciSchema.safeParse(values);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors, success: false };
    }
    let result;
    const resultCheck = await getPodaciPreuzimanja(userId);
    if (resultCheck.success && resultCheck.data) {
      result = await updatePodaciPreuzimanja(userId, {
        ...parsed.data,
        postanskiBroj: Number(parsed.data.postanskiBroj),
        ime: parsed.data.ime,
        prezime: parsed.data.prezime,
      });
    } else {
      result = await createPodaciPreuzimanja(userId, {
        ...parsed.data,
        postanskiBroj: Number(parsed.data.postanskiBroj),
        ime: parsed.data.ime,
        prezime: parsed.data.prezime,
      });
    }
    if (!result.success) {
      return { error: { global: result.error }, success: false };
    }
    await ocistiKorpu(userId);
    return { error: {}, success: true };
  }, { error: {}, success: false });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t.naslov}
        </h2>
        {formState.success && <SuccessRedirect message={t.uspjeh || "Podaci su uspješno sačuvani!"} />}
        {!isFieldErrors(formState.error) && formState.error.global && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center">
            {formState.error.global}
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <Input
            name="ime"
            defaultValue={podaci?.ime || ""}
            placeholder={t.ime}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.ime)}
            aria-describedby="ime-error"
          />
          {isFieldErrors(formState.error) && formState.error?.ime && Array.isArray(formState.error.ime) && (
            <p id="ime-error" className="text-red-600 text-sm mt-1">{formState.error.ime.join(", ")}</p>
          )}
          <Input
            name="prezime"
            defaultValue={podaci?.prezime || ""}
            placeholder={t.prezime}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.prezime)}
            aria-describedby="prezime-error"
          />
          {isFieldErrors(formState.error) && formState.error?.prezime && Array.isArray(formState.error.prezime) && (
            <p id="prezime-error" className="text-red-600 text-sm mt-1">{formState.error.prezime.join(", ")}</p>
          )}
          <Input
            name="adresa"
            defaultValue={podaci?.adresa || ""}
            placeholder={t.adresa}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.adresa)}
            aria-describedby="adresa-error"
          />
          {isFieldErrors(formState.error) && formState.error?.adresa && Array.isArray(formState.error.adresa) && (
            <p id="adresa-error" className="text-red-600 text-sm mt-1">{formState.error.adresa.join(", ")}</p>
          )}
          <Input
            name="drzava"
            defaultValue={podaci?.drzava || ""}
            placeholder={t.drzava}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.drzava)}
            aria-describedby="drzava-error"
          />
          {isFieldErrors(formState.error) && formState.error?.drzava && Array.isArray(formState.error.drzava) && (
            <p id="drzava-error" className="text-red-600 text-sm mt-1">{formState.error.drzava.join(", ")}</p>
          )}
          <Input
            name="grad"
            defaultValue={podaci?.grad || ""}
            placeholder={t.grad}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.grad)}
            aria-describedby="grad-error"
          />
          {isFieldErrors(formState.error) && formState.error?.grad && Array.isArray(formState.error.grad) && (
            <p id="grad-error" className="text-red-600 text-sm mt-1">{formState.error.grad.join(", ")}</p>
          )}
          <Input
            name="postanskiBroj"
            defaultValue={podaci?.postanskiBroj?.toString() || ""}
            placeholder={t.postanskiBroj}
            type="number"
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.postanskiBroj)}
            aria-describedby="postanskiBroj-error"
          />
          {isFieldErrors(formState.error) && formState.error?.postanskiBroj && Array.isArray(formState.error.postanskiBroj) && (
            <p id="postanskiBroj-error" className="text-red-600 text-sm mt-1">{formState.error.postanskiBroj.join(", ")}</p>
          )}
          <Input
            name="telefon"
            defaultValue={podaci?.telefon || ""}
            placeholder={t.telefon}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.telefon)}
            aria-describedby="telefon-error"
          />
          {isFieldErrors(formState.error) && formState.error?.telefon && Array.isArray(formState.error.telefon) && (
            <p id="telefon-error" className="text-red-600 text-sm mt-1">{formState.error.telefon.join(", ")}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
          >
            {t.sacuvaj_podatke}
          </Button>
        </form>
      </div>
    </div>
  );
}
