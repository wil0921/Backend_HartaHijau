-- DropForeignKey
ALTER TABLE `otp_verification` DROP FOREIGN KEY `Otp_verification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `poin` DROP FOREIGN KEY `Poin_userId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_history` DROP FOREIGN KEY `Transaction_history_recipientId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_history` DROP FOREIGN KEY `Transaction_history_senderId_fkey`;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Otp_verification` ADD CONSTRAINT `Otp_verification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poin` ADD CONSTRAINT `Poin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction_history` ADD CONSTRAINT `Transaction_history_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction_history` ADD CONSTRAINT `Transaction_history_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
