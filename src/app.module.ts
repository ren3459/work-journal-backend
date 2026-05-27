import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypesModule } from './work-types/work-types.module';
import { WorkJournalModule } from './work-journal/work-journal.module';

@Module({
  imports: [PrismaModule, WorkTypesModule, WorkJournalModule],
})
export class AppModule {}
