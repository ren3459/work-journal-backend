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
  completedAt?: string;
  comment?: string;
}

interface FindWorkJournalPageOptions {
  sortField?: string;
  sortOrder?: string;
}

const getOrderBy = (
  sortField: string | undefined,
  sortOrder: Prisma.SortOrder,
):
  | Prisma.WorkLogOrderByWithRelationInput
  | Prisma.WorkLogOrderByWithRelationInput[] => {
  switch (sortField) {
    case 'typeWork':
      return { workType: { name: sortOrder } };
    case 'executorName':
      return { executorName: sortOrder };
    case 'volume':
      return { volume: sortOrder };
    case 'completedAt':
      return { completedAt: sortOrder };
    case 'status':
      return [
        {
          completedAt: {
            sort: sortOrder,
            nulls: sortOrder === 'asc' ? 'first' : 'last',
          },
        },
        { date: 'desc' },
      ];
    case 'createdAt':
      return { createdAt: sortOrder };
    case 'updatedAt':
      return { updatedAt: sortOrder };
    case 'date':
    default:
      return { date: sortOrder };
  }
};

const toDateOnly = (date: string): Date => new Date(`${date}T00:00:00.000Z`);

const getTodayDateOnly = (): Date => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return toDateOnly(`${year}-${month}-${day}`);
};

@Injectable()
export class WorkJournalService {
  constructor(private readonly prisma: PrismaService) {}

  async findPage(
    page: number,
    pageSize: number,
    options: FindWorkJournalPageOptions = {},
  ): Promise<WorkJournalPage> {
    const skip = (page - 1) * pageSize;
    const sortOrder = options.sortOrder === 'ascend' ? 'asc' : 'desc';
    const items: WorkJournalRecord[] = await this.prisma.workLog.findMany({
      skip,
      take: pageSize,
      include: {
        workType: true,
      },
      orderBy: getOrderBy(options.sortField, sortOrder),
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
        date: toDateOnly(payload.date),
        completedAt: payload.completedAt
          ? toDateOnly(payload.completedAt)
          : null,
        comment: payload.comment || null,
      },
      include: {
        workType: true,
      },
    });
  }

  async deleteById(workLogId: number) {
    return this.prisma.workLog.delete({ where: { id: workLogId } });
  }

  async updateById(workLogId: number, payload: CreateWorkJournalRecordPayload) {
    return this.prisma.workLog.update({
      where: { id: workLogId },
      data: {
        workTypeId: payload.workTypeId,
        executorName: payload.executorName,
        unit: payload.unit,
        volume: payload.volume,
        date: toDateOnly(payload.date),
        completedAt: payload.completedAt
          ? toDateOnly(payload.completedAt)
          : null,
        comment: payload.comment || null,
      },
      include: {
        workType: true,
      },
    });
  }

  async findById(workLogId: number) {
    return this.prisma.workLog.findUnique({
      where: { id: workLogId },
      include: {
        workType: true,
      },
    });
  }

  async getStatistic() {
    const workLogsCompleted = await this.prisma.workLog.count({
      where: { completedAt: getTodayDateOnly() },
    });
    const workLogsNOTCompleted = await this.prisma.workLog.count({
      where: { completedAt: null },
    });

    return {
      completedWorks: workLogsCompleted,
      notCompletedWorks: workLogsNOTCompleted,
    };
  }
}
