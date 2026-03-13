import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeDatabaseUrl(connectionString?: string): string | undefined {
  if (!connectionString) {
    return connectionString
  }

  const repaired = connectionString.replace(/(\?.*?)\?(?=[^/]*sslmode=)/i, "$1&")

  try {
    const url = new URL(repaired)
    const sslmode = url.searchParams.get("sslmode")

    if (!sslmode || ["prefer", "require", "verify-ca"].includes(sslmode)) {
      url.searchParams.set("sslmode", "verify-full")
    }

    return url.toString()
  } catch {
    return repaired.replace(/sslmode=(prefer|require|verify-ca)\b/gi, "sslmode=verify-full")
  }
}
