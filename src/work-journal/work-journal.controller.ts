import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { WorkJournalService } from './work-journal.service';

class CreateWorkJournalRecordDto {
  @IsInt()
  @Min(1)
  workTypeId!: number;

  @IsString()
  @IsNotEmpty()
  executorName!: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsNumber()
  @Min(0)
  volume!: number;

  @IsDateString()
  date!: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

class FindWorkJournalPageQueryDto {
  @IsString()
  @IsOptional()
  sortField?: string;

  @IsIn(['ascend', 'descend', 'asc', 'desc'])
  @IsOptional()
  sortOrder?: string;
}

@Controller('work-journal')
export class WorkJournalController {
  constructor(private readonly workJournalService: WorkJournalService) {}

  @Get()
  findPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
    @Query() query: FindWorkJournalPageQueryDto,
  ) {
    return this.workJournalService.findPage(page, pageSize, {
      sortField: query.sortField,
      sortOrder: query.sortOrder,
    });
  }

  @Post()
  create(@Body() payload: CreateWorkJournalRecordDto) {
    return this.workJournalService.create(payload);
  }

  @Get('statistic')
  getStatistic() {
    return this.workJournalService.getStatistic();
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) workLogId: number) {
    return this.workJournalService.deleteById(workLogId);
  }

  @Patch(':id')
  updateById(
    @Param('id', ParseIntPipe) workLogId: number,
    @Body() payload: CreateWorkJournalRecordDto,
  ) {
    return this.workJournalService.updateById(workLogId, payload);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) workLogId: number) {
    return this.workJournalService.findById(workLogId);
  }
}
