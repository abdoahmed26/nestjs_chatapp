import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1768058377342 implements MigrationInterface {
    name = 'Init1768058377342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message_reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reaction" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "messageId" uuid, "userId" uuid, CONSTRAINT "PK_654a9f0059ff93a8f156be66a5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."conversation_members_role_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "conversation_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."conversation_members_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "conversationId" uuid, CONSTRAINT "PK_33146a476696a973a14d931e675" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."conversations_type_enum" AS ENUM('private', 'group', 'channel')`);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "image" character varying(255), "type" "public"."conversations_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" uuid, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message_mentions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "messageId" uuid, "userId" uuid, CONSTRAINT "PK_6d3047d9fb0dd841366be90fb87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text, "files" text, "seen" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentMessageId" uuid, "repliesId" uuid, "senderId" uuid, "conversationId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message_reactions" ADD CONSTRAINT "FK_7623d77216e8457a552490259e0" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_reactions" ADD CONSTRAINT "FK_82d59cb474d00eea46d7e192f28" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_b49c970adabf84fd2b013b60a99" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_9a23e356db3cedb8d9725d01d1a" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_c6dbb33e45a0acdbf3c33051f74" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_mentions" ADD CONSTRAINT "FK_451947229942dee3c31b8b70213" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_mentions" ADD CONSTRAINT "FK_ab04d86f77ec7d208314185f24a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_379d3b2679ddf515e5a90de0153" FOREIGN KEY ("parentMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_528d3b9683aa15d90481bf208f2" FOREIGN KEY ("repliesId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_528d3b9683aa15d90481bf208f2"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_379d3b2679ddf515e5a90de0153"`);
        await queryRunner.query(`ALTER TABLE "message_mentions" DROP CONSTRAINT "FK_ab04d86f77ec7d208314185f24a"`);
        await queryRunner.query(`ALTER TABLE "message_mentions" DROP CONSTRAINT "FK_451947229942dee3c31b8b70213"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_c6dbb33e45a0acdbf3c33051f74"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_9a23e356db3cedb8d9725d01d1a"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_b49c970adabf84fd2b013b60a99"`);
        await queryRunner.query(`ALTER TABLE "message_reactions" DROP CONSTRAINT "FK_82d59cb474d00eea46d7e192f28"`);
        await queryRunner.query(`ALTER TABLE "message_reactions" DROP CONSTRAINT "FK_7623d77216e8457a552490259e0"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "message_mentions"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP TYPE "public"."conversations_type_enum"`);
        await queryRunner.query(`DROP TABLE "conversation_members"`);
        await queryRunner.query(`DROP TYPE "public"."conversation_members_role_enum"`);
        await queryRunner.query(`DROP TABLE "message_reactions"`);
    }

}
