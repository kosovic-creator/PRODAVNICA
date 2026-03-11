"use client";
import SuccessMessage from "../components/SuccessMessage";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function KorisniciSuccess({ message }: { message?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      router.replace(pathname);
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, router, pathname]);
  if (!message) return null;
  return <SuccessMessage message={message} />;
}
