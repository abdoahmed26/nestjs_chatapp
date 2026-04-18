import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776533980414 implements MigrationInterface {
    name = 'Init1776533980414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."calls_type_enum" AS ENUM('audio', 'video')`);
        await queryRunner.query(`CREATE TYPE "public"."calls_status_enum" AS ENUM('ringing', 'ongoing', 'ended', 'missed', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "calls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."calls_type_enum" NOT NULL, "status" "public"."calls_status_enum" NOT NULL DEFAULT 'ringing', "startedAt" TIMESTAMP WITH TIME ZONE, "endedAt" TIMESTAMP WITH TIME ZONE, "duration" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "callerId" uuid, "calleeId" uuid, "conversationId" uuid, CONSTRAINT "PK_d9171d91f8dd1a649659f1b6a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "calls" ADD CONSTRAINT "FK_a0781de29eae6a119141edd4031" FOREIGN KEY ("callerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "calls" ADD CONSTRAINT "FK_d0f2e470b45482680fc5f2cf408" FOREIGN KEY ("calleeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "calls" ADD CONSTRAINT "FK_dd1d1f39486b2f8c3255f0eba9d" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calls" DROP CONSTRAINT "FK_dd1d1f39486b2f8c3255f0eba9d"`);
        await queryRunner.query(`ALTER TABLE "calls" DROP CONSTRAINT "FK_d0f2e470b45482680fc5f2cf408"`);
        await queryRunner.query(`ALTER TABLE "calls" DROP CONSTRAINT "FK_a0781de29eae6a119141edd4031"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "calls"`);
        await queryRunner.query(`DROP TYPE "public"."calls_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."calls_type_enum"`);
    }

}
