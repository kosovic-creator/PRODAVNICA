import { Metadata } from 'next';
import PrijavaForm from "./PrijavaForm";

export const metadata: Metadata = {
  title: "Prijava",
};

export default function Prijava() {
  return <PrijavaForm />;
}
