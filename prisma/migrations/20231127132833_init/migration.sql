/*
  Warnings:

  - You are about to drop the column `category` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `chapter` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `users` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_category_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profileId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "category",
DROP COLUMN "chapter",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "chapterId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profileId",
ADD COLUMN     "profile_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
