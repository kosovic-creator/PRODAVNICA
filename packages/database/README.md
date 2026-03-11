# Shared Prisma Schema

Ovaj folder sadrži zajednički Prisma model i migracije za obe aplikacije:
- `apps/prodavnica-admin`
- `apps/prodavnica-client`

## 🔥 VAŽNA PRAVILA

### ✅ SAMO U OVOM FOLDERU:
1. **Izmene schema.prisma** - Uvek menjaj samo u `packages/database/schema.prisma`
2. **Kreiranje migracija** - Uvek pokreći `npx prisma migrate dev` samo ovde
3. **Prisma Studio** - Pokreći `npx prisma studio` samo ovde

### ⛔ NIKAD U ADMIN/CLIENT FOLDERIMA:
- ❌ NIKAD ne menjaj `schema.prisma` u admin/client folderima
- ❌ NIKAD ne pokreći `prisma migrate dev` u admin/client folderima
- ❌ NIKAD ne pokreći `prisma migrate reset` u admin/client folderima

---

## 📋 Workflow za promene modela

### 1. Izmeni Prisma model
```bash
cd /Users/drasko/PRODAVNICA/packages/database
# Izmeni schema.prisma
```

### 2. Kreiraj migraciju
```bash
# Kopiraj .env iz jedne od aplikacija (ako ne postoji lokalno)
cp ../../apps/prodavnica-admin/.env .env

# Kreiraj migraciju
npx prisma migrate dev --name describe_your_change

# Generiši Prisma Client
npx prisma generate
```

### 3. Sinhronizuj u obe aplikacije
```bash
# Admin aplikacija
cd ../../apps/prodavnica-admin
npx prisma generate

# Client aplikacija
cd ../../apps/prodavnica-client
npx prisma generate
```

### 4. Testiranje
```bash
# Pokreni obe aplikacije i testiraj da sve radi
cd ../../apps/prodavnica-admin && npm run dev
cd ../../apps/prodavnica-client && npm run dev
```

---

## 🚀 Setup za novi dev environment

```bash
cd /Users/drasko/PRODAVNICA/packages/database

# 1. Kopiraj i konfiguriši .env
cp .env.example .env
# Izmeni DATABASE_URL u .env

# 2. Primeni sve migracije
npx prisma migrate deploy

# 3. Generiši client
npx prisma generate

# 4. Generiši u obe aplikacije
cd ../../apps/prodavnica-admin && npx prisma generate
cd ../../apps/prodavnica-client && npx prisma generate
```

---

## 🔧 Korisne komande

```bash
# Prisma Studio (admin UI za bazu)
npx prisma studio

# Reset baze i primeni sve migracije
npx prisma migrate reset

# Deploy migracija na production
npx prisma migrate deploy

# Format schema
npx prisma format
```

---

## 📂 Struktura

```
packages/database/
├── schema.prisma       # Jedini izvor istine za model
├── migrations/         # Sve migracije (AUTO-SYNC u admin/client)
├── package.json        # Prisma dependencies
├── .env               # Lokalni DATABASE_URL (ne commit-uj!)
└── README.md          # Ova dokumentacija
```

---

## ⚠️ Troubleshooting

### Problem: "Column does not exist" u buildu
```bash
# Proveri koji DATABASE_URL se koristi
echo $DATABASE_URL

# Primeni migracije na taj DB
npx prisma migrate deploy
```

### Problem: Nesinhronizovani modeli
```bash
# Uvek regeneriši u obe aplikacije nakon izmena:
cd /Users/drasko/PRODAVNICA/packages/database && npx prisma generate
cd ../../apps/prodavnica-admin && npx prisma generate
cd ../../apps/prodavnica-client && npx prisma generate
```

### Problem: Konflikti u migracijama
```bash
# Reset i počni ispočetka (OPREZ: briše sve podatke!)
npx prisma migrate reset
```

---

## 📝 Git best practices

```bash
# Uvek commit-uj packages/database izmene PRVO
git add packages/database/
git commit -m "feat: add prodavnica_br field to ProizvodVarijanta"

# Zatim commit admin/client samo ako ima drugih izmena
# (ne commit-uj admin/client prisma foldere)
```

---

**Zapamti**: Jedan model → Jedan folder → Jedna migracija → Dva `generate`
