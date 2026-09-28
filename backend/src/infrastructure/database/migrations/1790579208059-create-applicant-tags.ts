import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateApplicantTags1790579208059 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // join table
    await queryRunner.createTable(
      new Table({
        name: 'applicant_tags',
        columns: [
          {
            name: 'applicant_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'tag_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('applicant_tags', [
      new TableForeignKey({
        columnNames: ['applicant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'applicant_profiles',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('applicant_tags');
  }
}
