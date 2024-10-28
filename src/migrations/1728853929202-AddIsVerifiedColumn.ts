import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsVerifiedColumn1728853929202 implements MigrationInterface {
    name = 'AddIsVerifiedColumn1728853929202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
    }

}
