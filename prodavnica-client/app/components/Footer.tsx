import { APP_NAME } from '../../lib/constants';
import Link from 'next/link';
import { FaMapLocationDot, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 border-t-4 border-amber-500">
      {/* Glavni sadržaj footera */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* O prodavnici */}
          <div className="flex flex-col">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-amber-400">✨</span> {APP_NAME}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Moderna e-commerce prodavnica sa najboljim izborom proizvoda i brza isporuka.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Brzi linkovi */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-base mb-4 border-b-2 border-amber-400 pb-2">
              Navigacija
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/proizvodi" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Proizvodi
              </Link>
              <Link href="/mapa" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2">
                <FaMapLocationDot size={16} /> Mapa
              </Link>
              <Link href="/korpa" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Korpa
              </Link>
              <Link href="/moje-porudzbine" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Moje porudžbine
              </Link>
            </nav>
          </div>

          {/* Korisnički nalog */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-base mb-4 border-b-2 border-amber-400 pb-2">
              Korisnički nalog
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/prijava" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Prijava
              </Link>
              <Link href="/registracija" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Registracija
              </Link>
              <Link href="/profil" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Profil
              </Link>
              <Link href="/omiljeni" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm">
                Omiljeni proizvodi
              </Link>
            </nav>
          </div>

          {/* Kontakt */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-base mb-4 border-b-2 border-amber-400 pb-2">
              Kontakt
            </h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+38267135355" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2">
                <FaPhone size={16} /> +382 (67) 135355
              </a>
              <a href="mailto:info@prodavnica.me" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2">
                <FaEnvelope size={16} /> info@prodavnica.me
              </a>
              <p className="text-slate-400 text-sm">
                <span className="font-semibold">Radno vreme:</span><br />
                Pon-Pet: 09:00-18:00<br />
                Sab: 10:00-16:00
              </p>
            </div>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Copyright i donje linkove */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} <span className="font-semibold text-amber-400">{APP_NAME}</span>.
            <span className="ml-2">Sva prava zadržana.</span><br className="sm:hidden" />
            <span className="text-xs mt-2 sm:mt-0">Izrada: Draško Kosović</span>
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
              Uslovi korišćenja
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
              Politika privatnosti
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
              Politika kolačića
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
