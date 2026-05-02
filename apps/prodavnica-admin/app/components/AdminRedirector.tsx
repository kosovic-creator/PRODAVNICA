/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminRedirector() {
  const { data: session, status } = useSession();
  const router = useRouter();

  type UserWithUloga = {
    uloga?: string;
    [key: string]: any;
  };

  type SessionWithUloga = {
    user?: UserWithUloga;
    [key: string]: any;
  };

  useEffect(() => {
    if (status === "loading") return;
    const sessionWithUloga = session as SessionWithUloga;
    if (sessionWithUloga?.user?.uloga === "admin" && router) {
      router.replace("/admin");
    }
  }, [session, status, router]);

  return null;
}
