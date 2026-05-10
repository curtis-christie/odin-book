/* =========================================================
  SEED DATA OVERVIEW

  Creates test users for manual backend testing:

  A. Alice follows Ben
  B. Alice has a pending follow request to Cara
  C. Dylan sent a rejected follow request to Alice
  D. Each user has sample posts
  E. Posts have sample comments and likes

  Shared test password:
  password123
   ========================================================= */

import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { FollowRequestStatus } from "../src/generated/prisma/client.js";
import { prisma } from "../src/db/prisma.js";

/* =========================================================
  A. SEED CONFIG
   ========================================================= */

const DEFAULT_PASSWORD = "password123";
const SALT_ROUNDS = 12;
const EXTRA_USER_COUNT = 8;

/* =========================================================
  B. RESET DATABASE
   ========================================================= */

async function resetDatabase(): Promise<void> {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.followRequest.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

/* =========================================================
  C. CREATE TEST USERS
   ========================================================= */

async function createTestUsers(passwordHash: string) {
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      username: "alice",
      passwordHash,
      firstName: "Alice",
      lastName: "Anderson",
      bio: "Testing the OdinBook feed as Alice.",
      profileImageUrl: "https://example.com/alice.png",
    },
  });

  const ben = await prisma.user.create({
    data: {
      email: "ben@example.com",
      username: "ben",
      passwordHash,
      firstName: "Ben",
      lastName: "Brooks",
      bio: "Ben has posts Alice should see after following.",
      profileImageUrl: "https://example.com/ben.png",
    },
  });

  const cara = await prisma.user.create({
    data: {
      email: "cara@example.com",
      username: "cara",
      passwordHash,
      firstName: "Cara",
      lastName: "Clark",
      bio: "Cara has a pending follow request from Alice.",
      profileImageUrl: "https://example.com/cara.png",
    },
  });

  const dylan = await prisma.user.create({
    data: {
      email: "dylan@example.com",
      username: "dylan",
      passwordHash,
      firstName: "Dylan",
      lastName: "Davis",
      bio: "Dylan has a rejected follow request to Alice.",
      profileImageUrl: "https://example.com/dylan.png",
    },
  });

  return {
    alice,
    ben,
    cara,
    dylan,
  };
}

/* =========================================================
  D. CREATE EXTRA USERS
   ========================================================= */

async function createExtraUsers(passwordHash: string) {
  return Promise.all(
    Array.from({ length: EXTRA_USER_COUNT }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          username: faker.internet
            .username()
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, "")
            .slice(0, 20),
          passwordHash,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          bio: faker.person.bio(),
          profileImageUrl: faker.image.avatar(),
        },
      }),
    ),
  );
}

/* =========================================================
  E. CREATE POSTS
   ========================================================= */

async function createPosts(userIds: {
  aliceId: string;
  benId: string;
  caraId: string;
  dylanId: string;
}) {
  const alicePost = await prisma.post.create({
    data: {
      authorId: userIds.aliceId,
      content: "Alice is testing her own feed post.",
    },
  });

  const benPost = await prisma.post.create({
    data: {
      authorId: userIds.benId,
      content:
        "Ben's post should appear in Alice's feed after Alice follows Ben.",
    },
  });

  const caraPost = await prisma.post.create({
    data: {
      authorId: userIds.caraId,
      content:
        "Cara's post should not appear in Alice's feed while the request is pending.",
    },
  });

  const dylanPost = await prisma.post.create({
    data: {
      authorId: userIds.dylanId,
      content: "Dylan's post should not appear in Alice's feed.",
    },
  });

  return {
    alicePost,
    benPost,
    caraPost,
    dylanPost,
  };
}

/* =========================================================
  F. CREATE SOCIAL DATA
   ========================================================= */

async function createSocialData(data: {
  aliceId: string;
  benId: string;
  caraId: string;
  dylanId: string;
  alicePostId: string;
  benPostId: string;
}) {
  await prisma.follow.create({
    data: {
      followerId: data.aliceId,
      followingId: data.benId,
    },
  });

  await prisma.followRequest.create({
    data: {
      senderId: data.aliceId,
      receiverId: data.caraId,
      status: FollowRequestStatus.PENDING,
    },
  });

  await prisma.followRequest.create({
    data: {
      senderId: data.dylanId,
      receiverId: data.aliceId,
      status: FollowRequestStatus.REJECTED,
    },
  });

  await prisma.comment.create({
    data: {
      postId: data.benPostId,
      authorId: data.aliceId,
      content: "Alice commenting on Ben's post.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: data.alicePostId,
      authorId: data.benId,
      content: "Ben commenting on Alice's post.",
    },
  });

  await prisma.like.create({
    data: {
      postId: data.benPostId,
      userId: data.aliceId,
    },
  });

  await prisma.like.create({
    data: {
      postId: data.alicePostId,
      userId: data.caraId,
    },
  });
}

/* =========================================================
  G. MAIN
   ========================================================= */

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  await resetDatabase();

  const { alice, ben, cara, dylan } = await createTestUsers(passwordHash);

  await createExtraUsers(passwordHash);

  const { alicePost, benPost } = await createPosts({
    aliceId: alice.id,
    benId: ben.id,
    caraId: cara.id,
    dylanId: dylan.id,
  });

  await createSocialData({
    aliceId: alice.id,
    benId: ben.id,
    caraId: cara.id,
    dylanId: dylan.id,
    alicePostId: alicePost.id,
    benPostId: benPost.id,
  });

  console.log("Seed complete.");
  console.log(`Default password: ${DEFAULT_PASSWORD}`);
  console.log("Test users:");
  console.log("A. alice@example.com / alice");
  console.log("B. ben@example.com / ben");
  console.log("C. cara@example.com / cara");
  console.log("D. dylan@example.com / dylan");
  console.log("Relationships:");
  console.log("A. Alice follows Ben");
  console.log("B. Alice has a pending request to Cara");
  console.log("C. Dylan has a rejected request to Alice");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
