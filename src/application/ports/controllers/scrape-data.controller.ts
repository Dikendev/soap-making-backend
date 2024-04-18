import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScrapeDataRepository } from '../../repository/scrape-data.repository';
import { IsNotEmpty, IsString } from 'class-validator';
import { OilRepository } from '../../repository/oil-repository';
import { OilsDto } from '../services/oil/model';

export class ScrapeDataLanguageDto {
  @IsNotEmpty()
  @IsString()
  fromLanguage: string;

  @IsNotEmpty()
  @IsString()
  targetLanguage: string;
}

@Controller('scrape-data')
export class ScrapeDataController {
  constructor(
    private readonly scrapeRepository: ScrapeDataRepository,
    private readonly oilRepository: OilRepository,
  ) {}

  @Get()
  async fetchData(): Promise<any> {
    return this.scrapeRepository.fetchData();
  }

  @Get('translate')
  async translateScrapedData(
    @Body() scrapeDataLanguageDto: ScrapeDataLanguageDto,
  ) {
    return this.scrapeRepository.translateScrapedData(
      scrapeDataLanguageDto.fromLanguage,
      scrapeDataLanguageDto.targetLanguage,
    );
  }

  @Post('save')
  async saveScrapeData(@Body() scrapeDataLanguageDto: ScrapeDataLanguageDto) {
    const scrapeData = await this.scrapeRepository.translateScrapedData(
      scrapeDataLanguageDto.fromLanguage,
      scrapeDataLanguageDto.targetLanguage,
    );

    if (Array.isArray(scrapeData)) {
      return this.oilRepository.registerManyOils(
        scrapeData as unknown as OilsDto,
      );
    }
  }
}
