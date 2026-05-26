import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type WorkJournalRecord = Prisma.WorkLogGetPayload<{
  include: {
    workType: true;
  };
}>;

export interface WorkJournalPage {
  items: WorkJournalRecord[];
  total: number;
  page: number;
}

interface CreateWorkJournalRecordPayload {
  workTypeId: number;
  executorName: string;
  unit: string;
  volume: number;
  date: string;
  comment?: string;
}

@Injectable()
export class WorkJournalService {
  constructor(private readonly prisma: PrismaService) {}

  async findPage(page: number, pageSize: number): Promise<WorkJournalPage> {
    const skip = (page - 1) * pageSize;
    const items: WorkJournalRecord[] = await this.prisma.workLog.findMany({
      skip,
      take: pageSize,
      include: {
        workType: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    const total: number = await this.prisma.workLog.count();

    return {
      items,
      total,
      page,
    };
  }

  create(payload: CreateWorkJournalRecordPayload): Promise<WorkJournalRecord> {
    return this.prisma.workLog.create({
      data: {
        workTypeId: payload.workTypeId,
        executorName: payload.executorName,
        unit: payload.unit,
        volume: payload.volume,
        date: new Date(payload.date),
        comment: payload.comment || null,
      },
      include: {
        workType: true,
      },
    });
  }
}
