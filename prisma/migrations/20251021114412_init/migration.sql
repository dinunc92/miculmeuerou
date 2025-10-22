/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `ok` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFeeRON` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `wantPrinted` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `childName` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `eyeColor` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `hairColor` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `hairstyle` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitRON` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `success` to the `EmailLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customization` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceRON` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."EmailLog" DROP CONSTRAINT "EmailLog_orderId_fkey";

-- DropIndex
DROP INDEX "public"."Order_stripeSessionId_key";

-- AlterTable
ALTER TABLE "EmailLog" DROP COLUMN "createdAt",
DROP COLUMN "ok",
DROP COLUMN "orderId",
ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "success" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingFeeRON",
DROP COLUMN "stripeSessionId",
DROP COLUMN "wantPrinted",
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "childName",
DROP COLUMN "eyeColor",
DROP COLUMN "gender",
DROP COLUMN "hairColor",
DROP COLUMN "hairstyle",
DROP COLUMN "type",
DROP COLUMN "unitRON",
ADD COLUMN     "customization" JSONB NOT NULL,
ADD COLUMN     "priceRON" INTEGER NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL;
