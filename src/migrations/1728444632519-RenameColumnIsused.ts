import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumnIsused1728444632519 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("otp", "Isused", "isUsed");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("otp", "isUsed", "Isused");
    }

}
