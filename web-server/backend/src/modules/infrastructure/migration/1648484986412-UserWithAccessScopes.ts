import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserWithAccessScopes1648484986412 implements MigrationInterface {
  name = 'UserWithAccessScopes1648484986412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL DEFAULT '',
        "email" character varying NOT NULL,
        "salt" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."access_scope_type_enum" AS ENUM('admin', 'superAdmin')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."access_scope_typeclarification_enum" AS ENUM(
        'fullAccess',
        'read',
        'create',
        'update',
        'delete'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "access_scope" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "type" "public"."access_scope_type_enum" NOT NULL,
        "typeClarification" "public"."access_scope_typeclarification_enum",
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_164688c7bea6c1553c6f340a307" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_to_access_scope" (
        "userId" integer NOT NULL,
        "accessScopeId" integer NOT NULL,
        CONSTRAINT "PK_d266ac225cf91a667fb25280154" PRIMARY KEY ("userId", "accessScopeId")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_3b3b197ff01eac3335a68b6b98" ON "user_to_access_scope" ("userId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_b1b310ebf5d5f06a848fb0897e" ON "user_to_access_scope" ("accessScopeId")
    `);
    await queryRunner.query(`
      ALTER TABLE "user_to_access_scope"
      ADD CONSTRAINT "FK_3b3b197ff01eac3335a68b6b98d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "user_to_access_scope"
      ADD CONSTRAINT "FK_b1b310ebf5d5f06a848fb0897e4" FOREIGN KEY ("accessScopeId") REFERENCES "access_scope"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_to_access_scope" DROP CONSTRAINT "FK_b1b310ebf5d5f06a848fb0897e4"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_to_access_scope" DROP CONSTRAINT "FK_3b3b197ff01eac3335a68b6b98d"
    `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_b1b310ebf5d5f06a848fb0897e"
    `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_3b3b197ff01eac3335a68b6b98"
    `);
    await queryRunner.query(`
      DROP TABLE "user_to_access_scope"
    `);
    await queryRunner.query(`
      DROP TABLE "access_scope"
    `);
    await queryRunner.query(`
      DROP TYPE "public"."access_scope_typeclarification_enum"
    `);
    await queryRunner.query(`
      DROP TYPE "public"."access_scope_type_enum"
    `);
    await queryRunner.query(`
      DROP TABLE "user"
    `);
  }
}
