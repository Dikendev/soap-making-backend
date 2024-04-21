import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { OilResponse, OilsDto } from '../ports/services/oil/model';
import { DataToUpdate } from '../ports/services/oil/oil-prisma.service';
import { ScrapeDataLanguageDto } from '../ports/controllers/scrape-data.controller';

export class FindOilByNameQuery {
  @MinLength(5)
  @IsNotEmpty()
  @IsString()
  name: string;
}

export abstract class OilRepository {
  abstract registerOil: (oil: any) => Promise<OilResponse>;
  abstract findOils: () => Promise<OilResponse[]>;
  abstract findOilByName: (
    findOilByNameQuery: FindOilByNameQuery,
  ) => Promise<OilResponse>;
  abstract registerManyOils: (oils: OilsDto) => Promise<string>;
  abstract deleteAllOils: () => Promise<string>;
  abstract registerNewTranslationByName: (
    findOilByNameQuery: FindOilByNameQuery,
    dataToUpdate: DataToUpdate,
  ) => Promise<OilResponse>;
  abstract registerNewTranslationToExistingOil: (
    scrapeDataLanguageDto: ScrapeDataLanguageDto,
  ) => Promise<string>;
}
