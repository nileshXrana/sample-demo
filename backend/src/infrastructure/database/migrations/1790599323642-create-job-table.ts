import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableUnique,
} from 'typeorm';

export class CreateJobTable1790599323642 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'jobs',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                { name: 'admin_id', type: 'uuid' },
                { name: 'title', type: 'varchar' },
                { name: 'department', type: 'varchar', isNullable: true },
                { name: 'location', type: 'varchar', isNullable: true },
                { name: 'employment_type', type: 'enum', enum: ['full-time', 'part-time', 'contract', 'internship'] },
                { name: 'minimum_experience', type: 'integer', default: 0 },
                { name: 'application_deadline', type: 'date', isNullable: true },
                { name: 'status', type: 'enum', enum: ['open', 'closed'], default: "'open'" },
                { name: 'created_at', type: 'timestamp', default: 'now()' },
                { name: 'updated_at', type: 'timestamp', default: 'now()' },
            ],
        }));
        await queryRunner.createForeignKey('jobs', new TableForeignKey({
            columnNames: ['admin_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE',
        }));

        await queryRunner.createTable(new Table({
            name: 'job_tags',
            columns: [
                { name: 'job_id', type: 'uuid', isPrimary: true },
                { name: 'tag_id', type: 'uuid', isPrimary: true },
            ],
        }));
        await queryRunner.createForeignKeys('job_tags', [
            new TableForeignKey({ columnNames: ['job_id'], referencedTableName: 'jobs', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
            new TableForeignKey({ columnNames: ['tag_id'], referencedTableName: 'tags', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ]);

        await queryRunner.createTable(new Table({
            name: 'applications',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                { name: 'job_id', type: 'uuid' },
                { name: 'applicant_id', type: 'uuid' },
                { name: 'status', type: 'enum', enum: ['applied', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'], default: "'applied'" },
                { name: 'applied_at', type: 'timestamp', default: 'now()' },
            ],
        }));
        await queryRunner.createUniqueConstraint('applications', new TableUnique({ columnNames: ['job_id', 'applicant_id'] }));
        await queryRunner.createForeignKeys('applications', [
            new TableForeignKey({ columnNames: ['job_id'], referencedTableName: 'jobs', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
            new TableForeignKey({ columnNames: ['applicant_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        ]);

        await queryRunner.createTable(new Table({
            name: 'application_status_history',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                { name: 'application_id', type: 'uuid' },
                { name: 'from_status', type: 'enum', enum: ['applied', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'], isNullable: true },
                { name: 'to_status', type: 'enum', enum: ['applied', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'] },
                { name: 'performed_by', type: 'uuid' },
                { name: 'performed_by_role', type: 'varchar' },
                { name: 'created_at', type: 'timestamp', default: 'now()' },
            ],
        }));
        await queryRunner.createForeignKeys('application_status_history', [
            new TableForeignKey({ columnNames: ['application_id'], referencedTableName: 'applications', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
            new TableForeignKey({ columnNames: ['performed_by'], referencedTableName: 'users', referencedColumnNames: ['id'] }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('application_status_history');
        await queryRunner.dropTable('applications');
        await queryRunner.dropTable('job_tags');
        await queryRunner.dropTable('jobs');
    }
}
