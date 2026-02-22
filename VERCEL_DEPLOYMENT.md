# Monorepo Setup - Vercel Deployment

## Struktura

Ovo je NPM workspaces monorepo sa sledećom strukturom:

```
/shared-prisma       - Deljeni Prisma schema i migracije
/prodavnica-admin    - Admin dashboard aplikacija
/prodavnica-client   - Customer-facing aplikacija
/root package.json   - Workspace definicija
```

## Vercel Deployment

### Konfiguracija

Vercel automatski detektuje NPM workspaces iz root `package.json` fajla. To znači da će Vercel:

1. Instalirati sve zavisnosti iz root `package.json`
2. Protegnuti workspaces linkove
3. Pokrenuti `npm run build -w prodavnica-admin/client` za build svake aplikacije

### Kako to radi

- **Root package.json**: Definiše workspaces u `"workspaces": ["shared-prisma", "prodavnica-admin", "prodavnica-client"]`
- **Prisma Config**: Svaka aplikacija ima `prisma.config.ts` koji pokazuje na `../shared-prisma/schema.prisma`
- **Build Scripts**: Svaka aplikacija ima `"build": "npx prisma generate && next build"` što generiše Prisma client iz deljene šeme

### Deployment Koraci

1. Vercel instališe sve iz root `package.json` - to će instalirati sve workspaces
2. Vercel generiše Prisma client u shared-prisma (`npm run generate -w @prodavnica/prisma`)
3. Vercel build-a svaku aplikaciju sa njom specificira build command

### Environment Variables

Vercel će trebati sledeće environment variables:
- `DATABASE_URL` - PostgreSQL konekcioni string (za Neon)

Te varijable će biti dostupne svim aplikacijama jer Vercel vodi .env iz sistema za sve procesare u monorepo.

### Monorepo Build Tips

- Ako Vercel ne detektuje workspaces, eksplicitno kopiraj shared-prisma u build folder
- Ako Prisma ne može priti schema-u, pretvori ji putanju relativno od apps
- Ako build kažu da Prisma client nije generiše, dodaj `postinstall` script u apps (što je već urađeno)

## Lokalni Development

### Setup

```bash
npm install          # Instaliraj sve workspace zavisnosti
npm run dev         # Pokreni sve dev servere (ako je konfiguro u root)
```

### Build

```bash
npm run build        # Build-a sve apps
```

### Prisma Commands

```bash
npm run prisma:migrate:dev -w @prodavnica/prisma    # Kreiraj migraciju
npm run prisma:migrate:deploy -w @prodavnica/prisma  # Primeni migracije
npm run prisma:studio -w @prodavnica/prisma          # Otvori Prisma Studio
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
- Pokreni `npm install` u root direktorijumu
- Pokreni `npx prisma generate` u svakoj aplikaciji

### "Prisma schema not found"
- Pretvori da prisma.config.ts u svaku aplikaciju pokazuje na `../shared-prisma/schema.prisma`
- Pokreni `npx prisma generate` sa pravilnom konfigom

### Vercel Build Error: Cannot find shared-prisma
- Vercel automatski trebao da copy-a sve iz root direktorijuma
- Ako ne, onda je potrebno da dodasp .vercelignore ili da koristiš file: dependencies u package.json apps
