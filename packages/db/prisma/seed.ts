import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "../src/index.ts"

const accounts = [
  {
    name: "admin",
    email: "admin@capsa.com",
    password: "admin1234",
    role: "ADMIN" as const,
  },
  {
    name: "user",
    email: "user@capsa.com",
    password: "user1234",
    role: "USER" as const,
  },
]

async function main() {
  for (const account of accounts) {
    const hashed = await bcrypt.hash(account.password, 10)
    await prisma.account.upsert({
      where: { email: account.email },
      update: {},
      create: {
        name: account.name,
        email: account.email,
        password: hashed,
        role: account.role,
      },
    })
  }

  const count = await prisma.account.count()
  console.log(`Seeded. Total accounts in database: ${count}`)
}

main()
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
