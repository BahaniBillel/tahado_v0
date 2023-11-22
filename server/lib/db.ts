import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

  await prisma.users.create({
    data: {
  
      username: 'bahani billel',
      email: 'billel.bahani@gmail.com',
      password_hash: 'hashed_password1',
      first_name: 'billel',
      last_name: 'Bahani',
      date_of_birth: `1985-08-22T00:00:00.000Z`,
      address: '123 Main St',
      phone_number: "0554990201"
    },
  })


  const allUsers = await prisma.users.findMany()
  console.log(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })