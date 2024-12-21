-- DropForeignKey
ALTER TABLE `barters` DROP FOREIGN KEY `barters_meetup_id_fkey`;

-- DropForeignKey
ALTER TABLE `barters` DROP FOREIGN KEY `barters_user1_id_fkey`;

-- DropForeignKey
ALTER TABLE `barters` DROP FOREIGN KEY `barters_user1_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `barters` DROP FOREIGN KEY `barters_user2_id_fkey`;

-- DropForeignKey
ALTER TABLE `barters` DROP FOREIGN KEY `barters_user2_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_barter_id_fkey`;

-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_hire_id_fkey`;

-- DropForeignKey
ALTER TABLE `disputes` DROP FOREIGN KEY `disputes_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `disputes` DROP FOREIGN KEY `disputes_user1_id_fkey`;

-- DropForeignKey
ALTER TABLE `disputes` DROP FOREIGN KEY `disputes_user2_id_fkey`;

-- DropForeignKey
ALTER TABLE `features` DROP FOREIGN KEY `features_subscription_plan_id_fkey`;

-- DropForeignKey
ALTER TABLE `hires` DROP FOREIGN KEY `hires_broker_id_fkey`;

-- DropForeignKey
ALTER TABLE `hires` DROP FOREIGN KEY `hires_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `hires` DROP FOREIGN KEY `hires_target_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `item_images` DROP FOREIGN KEY `item_images_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_location_id_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_subcategory_id_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `meetups` DROP FOREIGN KEY `meetups_location_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_barter_id_fkey`;

-- DropForeignKey
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_broker_id_fkey`;

-- DropForeignKey
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_wrote_by_fkey`;

-- DropForeignKey
ALTER TABLE `subcategories` DROP FOREIGN KEY `subcategories_main_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `subscription_plans` DROP FOREIGN KEY `subscription_plans_target_user_type_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_settings_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_subscription_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_tier_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_user_status_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_user_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `wallets` DROP FOREIGN KEY `wallets_owner_id_fkey`;

-- DropIndex
DROP INDEX `barters_meetup_id_fkey` ON `barters`;

-- DropIndex
DROP INDEX `barters_user1_id_fkey` ON `barters`;

-- DropIndex
DROP INDEX `barters_user1_item_id_fkey` ON `barters`;

-- DropIndex
DROP INDEX `barters_user2_id_fkey` ON `barters`;

-- DropIndex
DROP INDEX `barters_user2_item_id_fkey` ON `barters`;

-- DropIndex
DROP INDEX `chats_barter_id_fkey` ON `chats`;

-- DropIndex
DROP INDEX `chats_hire_id_fkey` ON `chats`;

-- DropIndex
DROP INDEX `disputes_admin_id_fkey` ON `disputes`;

-- DropIndex
DROP INDEX `disputes_user1_id_fkey` ON `disputes`;

-- DropIndex
DROP INDEX `disputes_user2_id_fkey` ON `disputes`;

-- DropIndex
DROP INDEX `features_subscription_plan_id_fkey` ON `features`;

-- DropIndex
DROP INDEX `hires_broker_id_fkey` ON `hires`;

-- DropIndex
DROP INDEX `hires_client_id_fkey` ON `hires`;

-- DropIndex
DROP INDEX `hires_target_item_id_fkey` ON `hires`;

-- DropIndex
DROP INDEX `item_images_item_id_fkey` ON `item_images`;

-- DropIndex
DROP INDEX `items_category_id_fkey` ON `items`;

-- DropIndex
DROP INDEX `items_location_id_fkey` ON `items`;

-- DropIndex
DROP INDEX `items_subcategory_id_fkey` ON `items`;

-- DropIndex
DROP INDEX `items_wallet_id_fkey` ON `items`;

-- DropIndex
DROP INDEX `meetups_location_id_fkey` ON `meetups`;

-- DropIndex
DROP INDEX `messages_chat_id_fkey` ON `messages`;

-- DropIndex
DROP INDEX `messages_owner_id_fkey` ON `messages`;

-- DropIndex
DROP INDEX `ratings_barter_id_fkey` ON `ratings`;

-- DropIndex
DROP INDEX `ratings_broker_id_fkey` ON `ratings`;

-- DropIndex
DROP INDEX `ratings_wrote_by_fkey` ON `ratings`;

-- DropIndex
DROP INDEX `subcategories_main_category_id_fkey` ON `subcategories`;

-- DropIndex
DROP INDEX `subscription_plans_target_user_type_fkey` ON `subscription_plans`;

-- DropIndex
DROP INDEX `users_settings_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_subscription_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_tier_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_user_status_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_user_type_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `wallets_owner_id_fkey` ON `wallets`;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_type_id_fkey` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_status_id_fkey` FOREIGN KEY (`user_status_id`) REFERENCES `user_statuses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_settings_id_fkey` FOREIGN KEY (`settings_id`) REFERENCES `settings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscription_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_tier_id_fkey` FOREIGN KEY (`tier_id`) REFERENCES `tiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_plans` ADD CONSTRAINT `subscription_plans_target_user_type_fkey` FOREIGN KEY (`target_user_type`) REFERENCES `user_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `features` ADD CONSTRAINT `features_subscription_plan_id_fkey` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_main_category_id_fkey` FOREIGN KEY (`main_category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_barter_id_fkey` FOREIGN KEY (`barter_id`) REFERENCES `barters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_hire_id_fkey` FOREIGN KEY (`hire_id`) REFERENCES `hires`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_subcategory_id_fkey` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_images` ADD CONSTRAINT `item_images_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_wrote_by_fkey` FOREIGN KEY (`wrote_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_broker_id_fkey` FOREIGN KEY (`broker_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_barter_id_fkey` FOREIGN KEY (`barter_id`) REFERENCES `barters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hires` ADD CONSTRAINT `hires_target_item_id_fkey` FOREIGN KEY (`target_item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hires` ADD CONSTRAINT `hires_broker_id_fkey` FOREIGN KEY (`broker_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hires` ADD CONSTRAINT `hires_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_user1_id_fkey` FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disputes` ADD CONSTRAINT `disputes_user2_id_fkey` FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barters` ADD CONSTRAINT `barters_user1_id_fkey` FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barters` ADD CONSTRAINT `barters_user2_id_fkey` FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barters` ADD CONSTRAINT `barters_user1_item_id_fkey` FOREIGN KEY (`user1_item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barters` ADD CONSTRAINT `barters_user2_item_id_fkey` FOREIGN KEY (`user2_item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barters` ADD CONSTRAINT `barters_meetup_id_fkey` FOREIGN KEY (`meetup_id`) REFERENCES `meetups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetups` ADD CONSTRAINT `meetups_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
