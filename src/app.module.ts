import { Module } from '@nestjs/common';
import { PostgresModule } from 'src/database/postgres.module';
import { Modules } from './modules';

@Module({
    imports: [
        PostgresModule,
        ...Modules
    ],
})
export class AppModule { }
