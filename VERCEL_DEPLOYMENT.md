# Monorepo Setup - Vercel Deployment

## Struktura

Ovo je NPM workspaces monorepo sa sledećom strukturom:

```
/packages/database     - Deljeni Prisma schema i migracije
/apps/prodavnica-admin    - Admin dashboard aplikacija (port 4000)
/apps/prodavnica-client   - Customer-facing aplikacija (port 3000)
/root package.json   - Workspace definicija
```

## Vercel Deployment - VAŽNO!

Za monorepo na Vercel-u, potrebno je kreirati **DVA ODVOJENA PROJEKTA**:

### 1. PRODAVNICA-ADMIN Projekat

Na Vercel-u, kreiraj novi projekat sa:

- **Project Name**: `prodavnica-admin` (ili kako god želiš)
- **Framework Preset**: Next.js
- **Root Directory**: `apps/prodavnica-admin` ⚠️ **OVO JE KLJUČNO!**
- **Build Command**: `cd ../.. && npm run db:generate && npm run build:admin`
- **Install Command**: `cd ../.. && npm install`
- **Output Directory**: `.next` (default)

**Environment Variables** (u Vercel projektu):
```dd
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-admin-domain.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-admin-domain.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 2. PRODAVNICA-CLIENT Projekat

Na Vercel-u, kreiraj DRUGI projekat sa:

- **Project Name**: `prodavnica-client` (ili kako god želiš)
- **Framework Preset**: Next.js
- **Root Directory**: `apps/prodavnica-client` ⚠️ **OVO JE KLJUČNO!**
- **Build Command**: `cd ../.. && npm run db:generate && npm run build:client`
- **Install Command**: `cd ../.. && npm install`
- **Output Directory**: `.next` (default)

**Environment Variables** (u Vercel projektu):
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-client-domain.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-client-domain.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Koraci za Deploy na Vercel

1. **Idi na Vercel Dashboard**: https://vercel.com
2. **Import Git Repository**: Konektuj GitHub repo
3. **Konfiguriši Prvi Projekat (Admin)**:
   - Klikni "Configure Project"
   - Postavi "Root Directory" na `apps/prodavnica-admin`
   - Postavi "Install Command" na `cd ../.. && npm install`
   - Postavi "Build Command" na `cd ../.. && npm run db:generate && npm run build:admin`
   - Dodaj sve Environment Variables
   - Deploy!

4. **Kreiraj Drugi Projekat (Client)**:
   - Opet import-uj isti GitHub repo
   - Ovaj put postavi "Root Directory" na `apps/prodavnica-client`
   - Postavi "Install Command" na `cd ../.. && npm install`
   - Postavi "Build Command" na `cd ../.. && npm run db:generate && npm run build:client`
   - Dodaj sve Environment Variables (sa drugim URL-ovima!)
   - Deploy!

## Lokalni Development

### Setup

```bash
npm install          # Instaliraj sve workspace zavisnosti
npm run dev          # Pokreni oba dev servera (admin:4000, client:3000)
```

### Build

```bash
npm run build:admin   # Build-a samo admin
npm run build:client  # Build-a samo client
```

### Prisma Commands

```bash
npm run prisma:migrate:dev     # Kreiraj migraciju
npm run prisma:migrate:deploy  # Primeni migracije (production)
npm run prisma:studio          # Otvori Prisma Studio
```

## Kako radi Deployment

1. **Vercel detektuje monorepo** - vidi `workspaces` u root `package.json`
2. **Root Directory setting** - kaže Vercel-u koji workspace da deploy-uje
3. **Build Command** - `cd ../..` ide u root, instalira sve, pa build-a specifičan workspace
4. **Prisma** - svaki `postinstall` script automatski generiše Prisma client iz packages/database

## Troubleshooting

### "Cannot find module '@prisma/client'"
- Proveri da svaki workspace ima `"postinstall": "npx prisma generate"` u package.json
- Proveri da `prisma.config.ts` pokazuje na `../../packages/database/schema.prisma`

### "Prisma schema not found"
- Proveri da `packages/database/schema.prisma` postoji
- Proveri putanju u `prisma.config.ts`

### Build Command fails
- Proveri da Build Command počinje sa `cd ../..` da bi bio u root-u
- Proveri da koristiš `npm run build:admin` ili `npm run build:client` (ne `build`)

### Environment Variables not working
- Environment variables moraju biti konfigurisane POSEBNO u svakom Vercel projektu
- NEXTAUTH_URL i NEXT_PUBLIC_BASE_URL moraju biti različiti za admin i client

## Zašto DVA projekta?

- **Različiti domeni**: Admin i client će imati različite URL-ove
- **Nezavisni deployment**: Možeš deploy-ovati jedan bez drugog
- **Različite environment variables**: Svaki ima svoje URL-ove i moguće različite API ključeve
- **Bolja organizacija**: Jasno je šta je šta
