/*
  Warnings:

  - You are about to alter the column `handled_by_ai` on the `barters` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(8))`.

*/
-- AlterTable
ALTER TABLE `barters` MODIFY `handled_by_ai` ENUM('user1', 'user2', 'both', 'none') NOT NULL DEFAULT 'none';
