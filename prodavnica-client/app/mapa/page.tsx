"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientLayout from "../components/ClientLayout";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function MapPage() {
  return (
    <ClientLayout>
      <main className="p-8 space-y-4">
        <div>
          <Button variant="outline" asChild>
            <Link href="/">Nazad na pocetnu</Link>
          </Button>
        </div>
        <Map posix={[42.37502101208353, 19.252633449195127]} />
      </main>
    </ClientLayout>
  );
}
