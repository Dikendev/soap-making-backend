import { Controller, Get } from '@nestjs/common';
import { CheerioRepository } from './external/cheerio/cheerio.repository';
import { SaponificationTable } from './external/cheerio/cheerio.service';

@Controller()
export class AppController {
  constructor(private readonly webPageData: CheerioRepository) {}

  @Get()
  fetchWebData(): Promise<SaponificationTable> {
    return this.webPageData.fetchData();
  }
}
