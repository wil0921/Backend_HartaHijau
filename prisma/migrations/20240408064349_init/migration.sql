-- DropForeignKey
ALTER TABLE `otp_verification` DROP FOREIGN KEY `OTP_verification_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Otp_verification` ADD CONSTRAINT `Otp_verification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `otp_verification` RENAME INDEX `OTP_verification_userId_key` TO `Otp_verification_userId_key`;
