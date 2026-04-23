/*
  Warnings:

  - You are about to drop the column `acessToken` on the `SharedAccess` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `SharedAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `SharedAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SharedAccess_acessToken_key";

-- AlterTable
ALTER TABLE "SharedAccess" DROP COLUMN "acessToken",
ADD COLUMN     "accessToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccess_accessToken_key" ON "SharedAccess"("accessToken");
