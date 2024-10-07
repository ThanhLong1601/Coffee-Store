import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableOtp1728283615877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE otp (
                id INT PRIMARY KEY AUTO_INCREMENT,
                otp_code VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                attempts INT DEFAULT 0,
                Isused BOOLEAN DEFAULT FALSE,
                userId INT NOT NULL,
                CONSTRAINT FK_user_otp FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
            )
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE otp DROP FOREIGN KEY FK_user_otp
        `);
        await queryRunner.query(`
            DROP TABLE otp
        `);
    }

}
