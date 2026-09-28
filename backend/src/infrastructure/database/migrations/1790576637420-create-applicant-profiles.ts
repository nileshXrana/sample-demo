import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateApplicantProfiles1790576637420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applicant_profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'applicant_id',
            type: 'uuid',
          },
          {
            name: 'years_of_experience',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resume',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'applicant_profiles',
      new TableForeignKey({
        columnNames: ['applicant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropTable('applicant_tags');
    await queryRunner.dropTable('applicant_profiles');
  }
}
