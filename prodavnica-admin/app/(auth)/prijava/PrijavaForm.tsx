'use client';
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prijavaSchema } from "@/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaEnvelope, FaLock, FaSpinner, FaChevronDown, FaUser } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";

interface RecentLogin {
  email: string;
  lastUsed: string;
}

export default function PrijavaForm() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recentLogins, setRecentLogins] = useState<RecentLogin[]>([]);
  const [showRecentLogins, setShowRecentLogins] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentLogins');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentLogins(parsed);
      } catch (error) {
        console.error('Greška pri učitavanju skorašnjih prijava', error);
      }
    }
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const saveRecentLogin = (email: string) => {
    const newLogin: RecentLogin = {
      email,
      lastUsed: new Date().toISOString()
    };
    const updatedLogins = [newLogin, ...recentLogins.filter(login => login.email !== email)]
      .slice(0, 5);
    setRecentLogins(updatedLogins);
    localStorage.setItem('recentLogins', JSON.stringify(updatedLogins));
  };

  const selectRecentLogin = (recentEmail: string) => {
    setEmail(recentEmail);
    setShowRecentLogins(false);
  };

  const removeRecentLogin = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLogins = recentLogins.filter(login => login.email !== emailToRemove);
    setRecentLogins(updatedLogins);
    localStorage.setItem('recentLogins', JSON.stringify(updatedLogins));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.recent-logins-container')) {
        setShowRecentLogins(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationError(null);
    // Zod validacija
    const result = prijavaSchema.safeParse({ email, lozinka });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Neispravni podaci.";
      setValidationError(firstError);
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        lozinka,
      });
      if (!res?.error) {
        saveRecentLogin(email);
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('rememberMe');
        }
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (session?.user?.uloga === "admin") {
          router.push("/");
        } else {
          setError('Nemate dozvolu za pristup ovoj aplikaciji.');
        }
      } else {
        setError(res.error);
      }
    } catch {
      setError('neočekivana greška tokom prijave.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
          <FaSignInAlt className="text-lg" />
          {'Prijava'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative recent-logins-container">
            <div className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg input-focus">
              <FaEnvelope className="text-lg shrink-0" />
              <Input
                type="email"
                placeholder={'Email adresa'}
                className="flex-1 outline-none bg-transparent text-base"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              {recentLogins.length > 0 && (
                <Button
                  type="button"
                  onClick={() => setShowRecentLogins(!showRecentLogins)}
                  className="hover:text-shadow-gray-500 p-1 transition-colors"
                  disabled={loading}
                  title={'Skorašnje prijave'}
                  variant="ghost"
                  size="icon"
                >
                  <FaChevronDown className={`transition-transform duration-200 ${showRecentLogins ? 'rotate-180' : ''}`} />
                </Button>
              )}
            </div>
            {showRecentLogins && recentLogins.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                <div className="p-2 text-sm font-medium text-gray-600 border-b">
                  {'Skorašnje prijave'}
                </div>
                {recentLogins.map((login, index) => (
                  <div
                    key={index}
                    className="group flex items-center border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <Button
                      type="button"
                      onClick={() => selectRecentLogin(login.email)}
                      className="flex-1 text-left p-3 flex items-center gap-2"
                      disabled={loading}
                      variant="ghost"
                    >
                      <FaUser className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {login.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(login.lastUsed).toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => removeRecentLogin(login.email, e)}
                      className="p-2 mr-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      disabled={loading}
                      title={'ukloni ovaj nalog'}
                      variant="ghost"
                      size="icon"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg input-focus">
            <FaLock className="text-lg shrink-0" />
            <Input
              type="password"
              placeholder={'Lozinka'}
              className="flex-1 outline-none bg-transparent text-base"
              value={lozinka}
              onChange={e => setLozinka(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(val) => setRememberMe(Boolean(val))}
              disabled={loading}
              id="remember-me"
            />
            <label htmlFor="remember-me" className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Zapamti me
            </label>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={loading}
              className="flex-1"
            >
              Otkaži
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
              {loading ? 'Prijavljivanje' : 'Prijavi se'}
            </Button>
          </div>
        </form>
        {(validationError || error) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{validationError || error}</p>
          </div>
        )}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>
        </div>
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            {'Nemate nalog?'}{' '}
            <Button
              onClick={() => router.push('/registracija')}
              disabled={loading}
              className="font-medium underline transition-colors disabled:opacity-50 hover:text-blue-600"
              variant="link"
            >
              Registrujte se ovde
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
