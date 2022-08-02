import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserIdColumn1659453714985 implements MigrationInterface {
    name = 'AddUserIdColumn1659453714985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "UserId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "UserId"`);
    }

}
