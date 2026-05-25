import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypesModule } from './work-types/work-types.module';
import { WorkLogsModule } from './work-logs/work-logs.module';

@Module({
  imports: [PrismaModule, WorkTypesModule, WorkLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
