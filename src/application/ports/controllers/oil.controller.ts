import { Controller, Get } from '@nestjs/common';
import { OilRepository } from '../../repository/oil-repository';

@Controller('oil')
export class OilController {
  constructor(private readonly oilRepository: OilRepository) {}

  @Get()
  async getOil() {
    return this.oilRepository.getOils();
  }
}
