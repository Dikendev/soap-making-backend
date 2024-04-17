import { Controller, Get } from '@nestjs/common';
import { ScrapeDataRepository } from '../../repository/scrape-data.repository';

@Controller('scrape-data')
export class ScrapeDataController {
  constructor(private readonly scrapeRepository: ScrapeDataRepository) {}

  @Get()
  async fetchData(): Promise<any> {
    return this.scrapeRepository.fetchData();
  }
}
