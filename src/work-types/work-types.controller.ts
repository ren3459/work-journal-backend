import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { WorkTypesService } from './work-types.service';

class CreateWorkTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Get()
  findAll() {
    return this.workTypesService.findAll();
  }

  @Post()
  create(@Body() payload: CreateWorkTypeDto) {
    return this.workTypesService.create(payload.name);
  }
}
