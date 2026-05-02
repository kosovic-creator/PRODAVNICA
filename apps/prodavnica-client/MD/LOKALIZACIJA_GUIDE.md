# Optimizovana Lokalizacija

## 📋 Što se izbrisalo/promenilo

### Izbrisano:
- ❌ **Middleware** - više nije potreban
- ❌ **[locale] folder struktura** - više nije potrebna
- ❌ **Lang query parametri u URL-ima** - previše prop drilling-a
- ❌ **Direktni import JSON fajlova** - centralizovano

### Dodano:
- ✅ **LanguageContext** - globalni kontekst za jezik
- ✅ **useLanguage() hook** - jednostavno korišćenje jezyka bilo gde
- ✅ **Translations helper** - centralizovana logika za prevode
- ✅ **Providers wrapper** - svi client providers na jednom mestu
- ✅ **Cookie-based persistence** - automatsko čuvanje izbora jezika

---

## 🎯 Kako koristiti

### 1. Pristup jeziku i promenama u Client komponentama

```tsx
'use client';
import { useLanguage } from '@/app/components/LanguageContext';

export function MyComponent() {
  const { lang, setLang } = useLanguage();

  // Koristi lang: 'sr' ili 'en'
  const handleSwitchLanguage = () => {
    setLang(lang === 'sr' ? 'en' : 'sr');
  };

  return (
    <button onClick={handleSwitchLanguage}>
      {lang === 'sr' ? 'Promeni na EN' : 'Switch to SR'}
    </button>
  );
}
```

### 2. Korišćenje prevoda

```tsx
'use client';
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';

export function MyComponent() {
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'navbar'); // 'navbar' | 'common' | 'auth' | ...

  return <h1>{t.title}</h1>; // Koristi prevode kao obični objekat
}
```

### 3. Direktan pristup prevodima (bez hook-a)

```tsx
import { t } from '@/lib/translations';

// U bilo kom kontekstu kada znaš jezik
const label = t('sr', 'navbar', 'title'); // ili en

// Sa fallback vrednosti
const label = t('sr', 'navbar', 'title', 'Default naslov');
```

---

## 📁 Struktura fajlova

```
app/
├── components/
│   ├── LanguageContext.tsx    ← Globalni kontekst za jezik
│   ├── Providers.tsx          ← Wrapper za sve providere
│   ├── Navbar.tsx             ← Koristi useLanguage()
│   ├── Sidebar.tsx            ← Koristi useLanguage()
│   └── ClientLayout.tsx       ← Koristi Providers
│
lib/
├── translations.ts            ← Helper funkcije za prevode
├── locales.ts                 ← Utility funkcije (validacija, cookie)
└── useLanguage.ts             ← (Opciono) Standalone hook
│
i18n/
├── config.ts                  ← i18next konfiguracija
└── locales/
    ├── sr/
    │   ├── common.json
    │   ├── navbar.json
    │   └── ...
    └── en/
        ├── common.json
        ├── navbar.json
        └── ...
```

---

## 🔄 Migracija postojećih komponenti

### Staro (sa prop drilling):
```tsx
// page.tsx
export default async function Page() {
  const lang = getLanguageFromCookie();
  return <ClientLayout lang={lang}>
    <Navbar lang={lang} />
    <GridPage lang={lang} />
  </ClientLayout>
}
```

### Novo (sa Context-om):
```tsx
// page.tsx
export default async function Page() {
  return <ClientLayout>
    <Navbar />
    <GridPage />
  </ClientLayout>
}
```

### U komponentama:

**Staro:**
```tsx
const Navbar: React.FC<{ lang: string }> = ({ lang }) => {
  const t = lang === 'en' ? en : sr;
  return <div>{t.title}</div>;
}
```

**Novo:**
```tsx
const Navbar: React.FC = () => {
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'navbar');
  return <div>{t.title}</div>;
}
```

---

## 🔧 Koraka za migraciju postojećih stranica

### 1. Ukloniti lang iz page props
```tsx
// Bilo koja page.tsx - ukloniti je od searchParams
```

### 2. Ukloniti lang iz komponenti
```tsx
// Ukloniti lang prop iz svih komponenti
// Manje: <Navbar lang={lang} />
// Više: <Navbar />
```

### 3. Koristiti useLanguage() u Client komponentama
```tsx
'use client';
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';

export function MyComp() {
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'navbar');
  // ...
}
```

---

## 🌍 Podržani jezici

- `sr` - Srpski (default)
- `en` - Engleski

## 📝 Cookie

- **Ime:** `lang`
- **Vrednost:** `'sr'` ili `'en'`
- **Trajanje:** 1 godina
- **Pristup:** Automatski, bez ručnog postavljanja

---

## ⚡ Performance poboljšanja

1. ✅ **Bez middleware overhead-a** - brže učitavanje
2. ✅ **Manje URL-ove** - nema lang query parametara
3. ✅ **Centralizovani prevodi** - lakše održavanje
4. ✅ **Context provider** - izbegavan prop drilling
5. ✅ **Lazy loading namespace-a** - samo potrebni prevodi se učitavaju

---

## 🐛 Troubleshooting

### Problem: "useLanguage must be used within LanguageProvider"
**Rešenje:** Proveri da komponenta ima `'use client'` na početku i da je obavljena sa `<LanguageProvider>`

### Problem: Jezik se ne čuva nakon reload-a
**Rešenje:** Proveri da je `setLanguageCookie()` pozvan kada se menja jezik

### Problem: Prevodi nisu dostupni
**Rešenje:**
1. Proveri da je namespace validan (mora biti fajl u `i18n/locales/sr/` i `i18n/locales/en/`)
2. Proveri da JSON fajlovi sadrže tražene ključeve

---

## 📚 Primer kompletan kod

```tsx
'use client';

import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const t = getNamespace(lang, 'navbar');

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLang('sr')}
        className={lang === 'sr' ? 'font-bold' : ''}
      >
        {t.sr}
      </button>
      <button
        onClick={() => setLang('en')}
        className={lang === 'en' ? 'font-bold' : ''}
      >
        {t.en}
      </button>
    </div>
  );
}
```

---

✨ **Lokalizacija je sada čista, jednostavna i performantna!**
xx