import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsDateString,
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

  @IsString()
  @IsOptional()
  comment?: string;
}

@Controller('work-journal')
export class WorkJournalController {
  constructor(private readonly workJournalService: WorkJournalService) {}

  @Get()
  findPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
  ) {
    return this.workJournalService.findPage(page, pageSize);
  }

  @Post()
  create(@Body() payload: CreateWorkJournalRecordDto) {
    return this.workJournalService.create(payload);
  }
}
