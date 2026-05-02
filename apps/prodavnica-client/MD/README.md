"use client";  // ← Klijentska komponenta
import { useActionState } from "react";
import { registerAction } from "@/actions/register";  // ← IMPORT OBAVEZAN!

export default function Form() {
  const [state, formAction] = useActionState(registerAction, {});
//add
  return <form action={formAction}>...</form>;  // ← Poziv preko hook-a
}
@import 'leaflet/dist/leaflet.css';


lsof -ti:4000 | xargs kill -9 2>/dev/null && echo "Port 4000 closed" || echo "No process on port 4000"

lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "Port 3000 closed" || echo "No process on port 3000"