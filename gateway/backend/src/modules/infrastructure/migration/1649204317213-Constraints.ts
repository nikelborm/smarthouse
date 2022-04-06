import { MigrationInterface, QueryRunner } from 'typeorm';

export class Constraints1649204317213 implements MigrationInterface {
  name = 'Constraints1649204317213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "endpoint"
      ADD CONSTRAINT "CHK_67bf8297e66796700ddf6278a3" CHECK (
        (
          type <> 'universalSink'
          AND "eventId" is not null
        )
        OR (
          type = 'universalSink'
          AND "eventId" is null
        )
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "endpoint"
      ADD CONSTRAINT "UQ_81d3d5eb8cd31fc7ab912d5ee39" UNIQUE ("client_id", "endpoint_name")
    `);
    await queryRunner.query(`
      ALTER TABLE "endpoint"
      ADD CONSTRAINT "UQ_6d5348e37d3ff8b80e49f6e8804" UNIQUE ("client_id", "endpoint_shortcode")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "endpoint" DROP CONSTRAINT "UQ_6d5348e37d3ff8b80e49f6e8804"
    `);
    await queryRunner.query(`
      ALTER TABLE "endpoint" DROP CONSTRAINT "UQ_81d3d5eb8cd31fc7ab912d5ee39"
    `);
    await queryRunner.query(`
      ALTER TABLE "endpoint" DROP CONSTRAINT "CHK_67bf8297e66796700ddf6278a3"
    `);
  }
}
