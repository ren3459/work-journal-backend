import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypesModule } from './work-types/work-types.module';
import { WorkJournalModule } from './work-journal/work-journal.module';

@Module({
  imports: [PrismaModule, WorkTypesModule, WorkJournalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
