import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { prisma } from "../src/db/prisma.js";

const USER_COUNT = 12;
const DEFAULT_PASSWORD = "password123";
const SALT_ROUNDS = 10;

async function clearDatabase() {
  await prisma.user.deleteMany();
}

async function createFakeUser(passwordHash: string) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return prisma.user.create({
    data: {
      email: faker.internet
        .email({
          firstName,
          lastName,
        })
        .toLowerCase(),
      username: faker.internet
        .username({
          firstName,
          lastName,
        })
        .toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      bio: faker.person.bio(),
      profileImageUrl: faker.image.avatar(),
    },
  });
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const users = [];

  for (let index = 0; index < USER_COUNT; index += 1) {
    const user = await createFakeUser(passwordHash);
    users.push(user);
  }

  return users;
}

async function main() {
  console.log("Clearing database...");
  await clearDatabase();

  console.log("Creating users...");
  const users = await seedUsers();

  console.log(`Seeded ${users.length} users.`);
  console.log(`Default fake user password: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
