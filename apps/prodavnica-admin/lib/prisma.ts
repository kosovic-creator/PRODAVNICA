import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { normalizeDatabaseUrl } from '@prodavnica/lib'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
})

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma