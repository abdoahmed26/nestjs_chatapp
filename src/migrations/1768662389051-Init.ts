import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1768662389051 implements MigrationInterface {
    name = 'Init1768662389051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_b49c970adabf84fd2b013b60a99"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_b49c970adabf84fd2b013b60a99" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_b49c970adabf84fd2b013b60a99"`);
        await queryRunner.query(`ALTER TABLE "conversations" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_b49c970adabf84fd2b013b60a99" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
