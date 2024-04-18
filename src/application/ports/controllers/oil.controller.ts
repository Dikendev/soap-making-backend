import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { OilRepository } from '../../repository/oil-repository';
import { CreateOilDto, OilResponse, OilsDto } from '../services/oil/model';

@Controller('oil')
export class OilController {
  constructor(private readonly oilRepository: OilRepository) {}

  @Get('find-many')
  async findOils(): Promise<OilResponse[]> {
    return this.oilRepository.findOils();
  }

  @Post('register')
  async registerOil(@Body() createOilDto: CreateOilDto): Promise<OilResponse> {
    return this.oilRepository.registerOil(createOilDto);
  }

  @Post('register-many')
  async registerManyOils(@Body() oilsDto: OilsDto): Promise<string> {
    return this.oilRepository.registerManyOils(oilsDto);
  }

  @Delete('delete-all')
  async deleteAllOils(): Promise<string> {
    return this.oilRepository.deleteAllOils();
  }
}
