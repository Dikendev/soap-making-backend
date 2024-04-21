import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  FindOilByNameQuery,
  OilRepository,
} from '../../repository/oil-repository';
import { CreateOilDto, OilResponse, OilsDto } from '../services/oil/model';
import { ScrapeDataLanguageDto } from './scrape-data.controller';
import { ScrapeDataRepository } from '../../repository/scrape-data.repository';

@Controller('oil')
export class OilController {
  constructor(
    private readonly oilRepository: OilRepository,
    private readonly scrapeRepository: ScrapeDataRepository,
  ) {}

  @Get('find-many')
  async findOils(): Promise<OilResponse[]> {
    return this.oilRepository.findOils();
  }

  @Get('find-by-name')
  async findOilByName(
    @Query() findOilByNameQuery: FindOilByNameQuery,
  ): Promise<OilResponse> {
    return this.oilRepository.findOilByName(findOilByNameQuery);
  }

  @Post('register')
  async registerOil(@Body() createOilDto: CreateOilDto): Promise<OilResponse> {
    return this.oilRepository.registerOil(createOilDto);
  }

  @Post('save')
  async saveScrapeData(@Body() scrapeDataLanguageDto: ScrapeDataLanguageDto) {
    const scrapeData = await this.scrapeRepository.translateScrapedData(
      scrapeDataLanguageDto.targetLanguage,
    );

    if (Array.isArray(scrapeData)) {
      return this.oilRepository.registerManyOils(
        scrapeData as unknown as OilsDto,
      );
    }
  }

  @Post('register-new-language')
  async registerNewLanguage(
    @Body() scrapeDataLanguageDto: ScrapeDataLanguageDto,
  ): Promise<string> {
    return this.oilRepository.registerNewTranslationToExistingOil(
      scrapeDataLanguageDto,
    );
  }

  @Delete('delete-all')
  async deleteAllOils(): Promise<string> {
    return this.oilRepository.deleteAllOils();
  }
}
