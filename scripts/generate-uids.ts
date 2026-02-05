// Script to generate UIDs for existing users
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function generateUIDs() {
  console.log("Starting UID generation...");

  // First, check all users
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      uid: true,
      name: true,
    },
  });

  console.log(`Total users: ${allUsers.length}`);
  console.log("User UIDs:", allUsers.map(u => ({ name: u.name, uid: u.uid })));

  // Find all users without a UID
  const usersWithoutUID = allUsers.filter(u => !u.uid);

  console.log(`Found ${usersWithoutUID.length} users without UID`);

  // Generate UIDs for each user
  for (const user of usersWithoutUID) {
    // Generate a random 16-digit UID
    const uid = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { uid },
      });
      console.log(`✓ Generated UID for ${user.name || user.id}: ${uid}`);
    } catch (error) {
      console.error(`✗ Failed to generate UID for ${user.name || user.id}:`, error);
    }
  }

  console.log("UID generation completed!");
}

generateUIDs()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
