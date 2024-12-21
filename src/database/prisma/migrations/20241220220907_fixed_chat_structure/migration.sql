/*
  Warnings:

  - You are about to drop the column `user1_id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `user2_id` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_user1_id_fkey`;

-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_user2_id_fkey`;

-- DropIndex
DROP INDEX `chats_user1_id_fkey` ON `chats`;

-- DropIndex
DROP INDEX `chats_user2_id_fkey` ON `chats`;

-- AlterTable
ALTER TABLE `chats` DROP COLUMN `user1_id`,
    DROP COLUMN `user2_id`,
    ADD COLUMN `hire_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_hire_id_fkey` FOREIGN KEY (`hire_id`) REFERENCES `hires`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
