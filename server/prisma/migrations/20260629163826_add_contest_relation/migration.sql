-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_contestId_fkey` FOREIGN KEY (`contestId`) REFERENCES `Contest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
