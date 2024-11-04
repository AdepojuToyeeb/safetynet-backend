import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATETABLES1730722018074 implements MigrationInterface {
    name = 'CREATETABLES1730722018074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying(60) NOT NULL, "phone_number" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_auths_channel_enum" AS ENUM('sms', 'email')`);
        await queryRunner.query(`CREATE TABLE "otp_auths" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "recipient" character varying(50) NOT NULL, "otp" character varying(10) NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "channel" "public"."otp_auths_channel_enum" NOT NULL, CONSTRAINT "PK_1e52afb772cd17a73222aac123f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otp_auths"`);
        await queryRunner.query(`DROP TYPE "public"."otp_auths_channel_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
