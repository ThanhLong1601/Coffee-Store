import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToOrders1728563021247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE orders
            ADD COLUMN user_id INT,
            ADD CONSTRAINT FK_User_Orders FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE orders
            DROP FOREIGN KEY FK_User_Orders
        `);
        await queryRunner.query(`
            ALTER TABLE orders
            DROP COLUMN userId
        `);
    }

}
