-- AlterTable
ALTER TABLE `otp_verification` MODIFY `otp` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction_history` MODIFY `transactionId` VARCHAR(191) NOT NULL;
