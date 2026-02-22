"use client";
import SuccessMessage from "../components/SuccessMessage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PorudzbineSuccess({ message }: { message?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      router.replace("/porudzbine");
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, router]);

  if (!message) return null;
  return <SuccessMessage message={message} />;
}
