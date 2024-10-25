import { MigrationInterface, QueryRunner } from "typeorm";

export class EditTableOtpAddColumnStatusTableOrder1729827278106 implements MigrationInterface {
    name = 'EditTableOtpAddColumnStatusTableOrder1729827278106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`status\` enum ('Init', 'Pending', 'Shipped', 'Delivered', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Init'`);
        await queryRunner.query(`ALTER TABLE \`otps\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD \`expires_at\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` DROP COLUMN \`expires_at\``);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD \`expires_at\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`status\``);
    }

}
