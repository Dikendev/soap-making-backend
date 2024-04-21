import { Body, Controller, Get } from '@nestjs/common';
import { ScrapeDataRepository } from '../../repository/scrape-data.repository';
import { IsNotEmpty, IsString } from 'class-validator';

export class ScrapeDataLanguageDto {
  @IsNotEmpty()
  @IsString()
  targetLanguage: string;
}

@Controller('scrape-data')
export class ScrapeDataController {
  constructor(private readonly scrapeRepository: ScrapeDataRepository) {}

  @Get()
  async fetchData(): Promise<any> {
    return this.scrapeRepository.fetchData();
  }

  @Get('translate')
  async translateScrapedData(
    @Body() scrapeDataLanguageDto: ScrapeDataLanguageDto,
  ) {
    return this.scrapeRepository.translateScrapedData(
      scrapeDataLanguageDto.targetLanguage,
    );
  }
}
