# @prodavnica/ui

Centralni UI komponenti paket za Prodavnica monorepo aplikacija. Sadrži sve shadcn/ui komponente koje se koriste u admin dashboard-u (`apps/prodavnica-admin`) i klijentskoj aplikaciji (`apps/prodavnica-client`).

## Pregled

Ovaj paket konsoliduje sve UI komponente kako bi se izbegle duplikati izmeđuAdmin i Client aplikacija. Bilo koja promena u UI komponentama se sada radi samo na jednom mestu.

## Komponente

- `Alert Dialog` - Alert dialozi
- `Badge` - Badge komponente
- `Button` - Dugmići sa različitim varijantama
- `Card` - Card kontejneri
- `Carousel` - Karusel komponente
- `Checkbox` - Checkbox inputi
- `Dialog` - Dialog modali
- `Drawer` - Drawer paneli
- `Dropdown Menu` - Padajući meniji
- `Form` - React Hook Form integracija
- `Input` - Text inputi
- `Label` - Labele
- `Radio Group` - Radio dugmići
- `Select` - Select dropdowni
- `Separator` - Separator linije
- `Sheet` - Sheet paneli
- `Table` - Table komponente
- `Textarea` - Textarea inputi

## Korišćenje

Sve komponente se mogu direktno importovati iz `@prodavnica/ui`:

```tsx
import { Button, Card, Input } from "@prodavnica/ui"
```

## Struktura

```
packages/ui/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   └── utils.ts
├── package.json
├── tsconfig.json
└── index.ts
```

## Zavisnosti

Koristi:
- React 19
- React DOM 19
- Radix UI za pristupačne komponente
- Lucide React za ikonice
- Tailwind CSS za stilizovanje
- Class Variance Authority za upravljanje varijantama
- React Hook Form za forme

## Razvoj

Da biste dodali novu komponentu:

1. Kreirajte novu datoteku u `components/ui/`
2. Implementirajte komponentu
3. Dodajte export u `index.ts`
4. Instalacija će biti automatska kroz npm workspaces

## NPM Scripts

```bash
npm run build  # Priprema za build (trenutno samo echo)
```

## Veza sa ostalim paketima

- `apps/prodavnica-admin` - Koristi komponente za admin dashboard
- `apps/prodavnica-client` - Koristi komponente za klijentsku web aplikaciju
- `packages/prisma` - Deljeni Prisma klijent

## Verzioniranje

@prodavnica/ui v0.1.0
