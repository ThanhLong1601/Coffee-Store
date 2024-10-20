import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColumnPrice1729391470185 implements MigrationInterface {
    name = 'RemoveColumnPrice1729391470185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP COLUMN \`price\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD \`price\` int NOT NULL`);
    }

}
