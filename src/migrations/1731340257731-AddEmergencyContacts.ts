import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmergencyContacts1731340257731 implements MigrationInterface {
    name = 'AddEmergencyContacts1731340257731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "emergency_contacts" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "phoneNumber" character varying(50) NOT NULL,
                "userId" integer,
                CONSTRAINT "PK_8be191845b6fca1c4e5ba5bd7d1" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "emergency_contacts"
            ADD CONSTRAINT "FK_9b9bb7f85035305c3dee924d222"
            FOREIGN KEY ("userId") REFERENCES "users"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "emergency_contacts"
            DROP CONSTRAINT "FK_9b9bb7f85035305c3dee924d222"
        `);

        await queryRunner.query(`
            DROP TABLE "emergency_contacts"
        `);
    }
}
