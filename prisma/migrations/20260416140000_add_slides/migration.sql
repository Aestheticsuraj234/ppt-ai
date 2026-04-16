-- CreateEnum
CREATE TYPE "PresentationStatus" AS ENUM ('DRAFT', 'GENERATING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "presentation" ADD COLUMN "status" "PresentationStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "slide" (
    "id" TEXT NOT NULL,
    "presentationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "imagePrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slide_presentationId_idx" ON "slide"("presentationId");

-- AddForeignKey
ALTER TABLE "slide" ADD CONSTRAINT "slide_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "presentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
