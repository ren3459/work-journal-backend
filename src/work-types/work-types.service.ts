import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkTypesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.workType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  create(name: string) {
    return this.prisma.workType.create({
      data: {
        name,
      },
    });
  }
}
