import { Module } from '@nestjs/common';
import { WorkJournalController } from './work-journal.controller';
import { WorkJournalService } from './work-journal.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkJournalController],
  providers: [WorkJournalService],
})
export class WorkJournalModule {}
