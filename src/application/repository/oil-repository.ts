import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import {
  OilModelResponse,
  OilResponse,
  OilsDto,
} from '../ports/services/oil/model';
import { DataToUpdate } from '../ports/services/oil/oil-prisma.service';
import { ScrapeDataLanguageDto } from '../ports/controllers/scrape-data.controller';

export class FindOilQuery {
  @MinLength(5)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Length(3, 3)
  @IsNotEmpty()
  @IsString()
  language: string;
}

export abstract class OilRepository {
  abstract registerOil(oil: any): Promise<OilResponse>;
  abstract findOils(): Promise<OilResponse[]>;
  abstract findOilByName(findOilQuery: FindOilQuery): Promise<OilModelResponse>;
  abstract registerManyOils(oils: OilsDto): Promise<string>;
  abstract deleteAllOils(): Promise<string>;
  abstract registerNewTranslationByName(
    name: string,
    dataToUpdate: DataToUpdate,
  ): Promise<OilResponse>;
  abstract registerNewTranslationToExistingOil(
    scrapeDataLanguageDto: ScrapeDataLanguageDto,
  ): Promise<string>;
}
