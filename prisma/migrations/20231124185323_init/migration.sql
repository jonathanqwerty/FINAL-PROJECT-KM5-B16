/*
  Warnings:

  - You are about to drop the column `profile` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profile_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile",
ADD COLUMN     "profileId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
