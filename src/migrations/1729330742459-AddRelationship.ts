import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationship1729330742459 implements MigrationInterface {
    name = 'AddRelationship1729330742459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`storeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`otps\` CHANGE \`isUsed\` \`isUsed\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`isOnsite\` \`isOnsite\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`time_prepare\` \`time_prepare\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_782da5e50e94b763eb63225d69d\` FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_782da5e50e94b763eb63225d69d\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`time_prepare\` \`time_prepare\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`isOnsite\` \`isOnsite\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`otps\` CHANGE \`isUsed\` \`isUsed\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`storeId\``);
    }

}
