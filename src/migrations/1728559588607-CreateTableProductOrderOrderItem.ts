import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableProductOrderOrderItem1728559588607 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                image VARCHAR(255) NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                price INT NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                quantity INT NOT NULL DEFAULT 1,
                ristretto INT,
                use_to BOOLEAN NOT NULL DEFAULT false,
                size INT NOT NULL,
                total_amount INT,
                time_prepare BOOLEAN NOT NULL DEFAULT false
            )
        `);

        await queryRunner.query(`
            CREATE TABLE order_item (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                total_price INT NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS order_item`);

        await queryRunner.query(`DROP TABLE IF EXISTS orders`);

        await queryRunner.query(`DROP TABLE IF EXISTS products`);
    }

}
