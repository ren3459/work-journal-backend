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
): Prisma.WorkLogOrderByWithRelationInput => {
  switch (sortField) {
    case 'typeWork':
      return { workType: { name: sortOrder } };
    case 'executorName':
      return { executorName: sortOrder };
    case 'volume':
      return { volume: sortOrder };
    case 'completedAt':
    case 'status':
      return { completedAt: sortOrder };
    case 'createdAt':
      return { createdAt: sortOrder };
    case 'updatedAt':
      return { updatedAt: sortOrder };
    case 'date':
    default:
      return { date: sortOrder };
  }
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
    const sortOrder =
      options.sortOrder === 'ascend' || options.sortOrder === 'asc'
        ? 'asc'
        : 'desc';
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
        date: new Date(payload.date),
        completedAt: payload.completedAt ? new Date(payload.completedAt) : null,
        comment: payload.comment || null,
      },
      include: {
        workType: true,
      },
    });
  }
}
