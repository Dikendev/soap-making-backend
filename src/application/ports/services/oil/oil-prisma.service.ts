import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../external/prisma/prisma.service';
import {
  FindOilQuery,
  OilRepository,
} from '../../../repository/oil-repository';
import {
  CreateOilDto,
  Name,
  OilByNameResponse,
  OilResponse,
  OilsDto,
} from './model';
import { ScrapeDataRepository } from '../../../repository/scrape-data.repository';
import { ScrapeDataLanguageDto } from '../../controllers/scrape-data.controller';

export interface DataToUpdate {
  translations: Name;
  INCIName: Name;
}

@Injectable()
export class OilPrismaService implements OilRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly scrapeRepository: ScrapeDataRepository,
  ) {}

  async registerOil(createOilDto: CreateOilDto): Promise<OilResponse> {
    try {
      const oilResponse = await this.prismaService.oil.create({
        data: {
          ...createOilDto,
          translations: {
            create: createOilDto.translations,
          },
          INCIName: { create: createOilDto.INCIName },
        },
      });

      if (!oilResponse) {
        throw new InternalServerErrorException('Error registering oil');
      }

      return new OilResponse(oilResponse);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOils(): Promise<OilResponse[]> {
    try {
      const oils = await this.prismaService.oil.findMany({
        include: { translations: true, INCIName: true },
      });

      if (!oils.length) {
        throw new NotFoundException('No oils found');
      }

      return oils.map((oil) => new OilResponse(oil));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOilByName(findOilQuery: FindOilQuery): Promise<OilByNameResponse> {
    const { name, language } = findOilQuery;
    console.log('findOilQuery', findOilQuery);
    try {
      const uniqueOilResponse = await this.prismaService.oil.findUnique({
        where: { name: name },
        select: {
          id: true,
          name: true,
          SAP: true,
          NAOH: true,
          KOH: true,
          translations: { where: { language: { equals: language } } },
          INCIName: { where: { language: { equals: language } } },
        },
      });

      if (!uniqueOilResponse) {
        const translationOilName =
          await this.prismaService.translation.findFirst({
            where: { name: name },
            include: {
              oil: {
                select: {
                  SAP: true,
                  NAOH: true,
                  KOH: true,
                  INCIName: { where: { language: { equals: language } } },
                },
              },
            },
          });

        console.log('translationOilName', translationOilName);

        if (!translationOilName) {
          throw new NotFoundException('Oil not found');
        }

        console.log('translationOilName', translationOilName);

        const oilModelResponse: OilByNameResponse = {
          id: translationOilName.id,
          name: translationOilName.name,
          SAP: translationOilName.oil.SAP,
          NAOH: translationOilName.oil.NAOH,
          KOH: translationOilName.oil.KOH,
          INCIName: translationOilName.oil.INCIName[0].name,
          language: translationOilName.language,
        };
        return oilModelResponse;
      }

      const oilModelResponse: OilByNameResponse = {
        id: uniqueOilResponse.id,
        name: uniqueOilResponse.name,
        SAP: uniqueOilResponse.SAP,
        NAOH: uniqueOilResponse.NAOH,
        KOH: uniqueOilResponse.KOH,
        INCIName: uniqueOilResponse.INCIName[0].name,
        language: uniqueOilResponse.translations[0].language,
      };
      console.log('uniqueOilResponse', uniqueOilResponse);

      return oilModelResponse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async registerManyOils(oilsDto: OilsDto): Promise<string> {
    try {
      const createOils = oilsDto.map((oil) =>
        this.prismaService.oil.create({
          data: {
            SAP: oil.SAP,
            NAOH: oil.NAOH,
            KOH: oil.KOH,
            name: oil.name,
            translations: {
              create: oil.translations,
            },
            INCIName: {
              create: oil.INCIName,
            },
          },
        }),
      );
      const createdOils = await this.prismaService.$transaction(createOils);
      const count = createdOils.length;

      if (!count || count === 0) {
        throw new InternalServerErrorException('Error registering oils');
      }

      return `Successfully registered ${count} oils`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async registerNewTranslationToExistingOil(
    scrapeDataLanguageDto: ScrapeDataLanguageDto,
  ): Promise<string> {
    try {
      const oilResponse = await this.scrapeRepository.translateScrapedData(
        scrapeDataLanguageDto.targetLanguage,
      );

      for (const oil of oilResponse) {
        const dataToTranslate: DataToUpdate = {
          translations: {
            language: oil.translations[0].language,
            name: oil.translations[0].name,
          },
          INCIName: {
            language: oil.INCIName[0]?.language,
            name: oil.INCIName[0]?.name,
          },
        };

        const oilTranslated = await this.registerNewTranslationByName(
          oil.name,
          dataToTranslate,
        );

        if (!oilTranslated) {
          throw new InternalServerErrorException('Error translating oil');
        }
      }
      return `Created ${oilResponse.length} oils`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async registerNewTranslationByName(
    name: string,
    dataToUpdate: DataToUpdate,
  ): Promise<OilResponse> {
    try {
      const foundOil = await this.prismaService.oil.findUnique({
        where: { name: name },
        include: { translations: true, INCIName: true },
      });

      if (!foundOil) {
        throw new NotFoundException('Oil not found');
      }

      const oilResponse = new OilResponse(foundOil);
      const dataToUpdateResponse = this.dataToUpdate(oilResponse, dataToUpdate);

      const oilTranslatedUpdate = await this.prismaService.oil.update({
        where: { id: foundOil.id },
        data: dataToUpdateResponse,
      });

      if (!oilTranslatedUpdate) {
        throw new InternalServerErrorException('Error updating oil');
      }

      return new OilResponse(oilTranslatedUpdate);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  dataToUpdate(oilResponse: OilResponse, dataToUpdate: DataToUpdate): any {
    const dataToUpdateResponse = {};

    const alreadyExistTranslations = oilResponse.translations.findIndex(
      (translation) => {
        return dataToUpdate.translations.language === translation.language;
      },
    );

    if (alreadyExistTranslations === -1) {
      dataToUpdateResponse['translations'] = {
        create: {
          language: dataToUpdate.translations.language,
          name: dataToUpdate.translations.name,
        },
      };
    }

    if (!dataToUpdate.INCIName.language || !dataToUpdate.INCIName.name) {
      return dataToUpdateResponse;
    }

    const alreadyExistINCIName = oilResponse.INCIName.findIndex((INCIName) => {
      return dataToUpdate.INCIName.language === INCIName.language;
    });

    if (alreadyExistINCIName === -1) {
      dataToUpdateResponse['INCIName'] = {
        create: {
          language: dataToUpdate.INCIName.language,
          name: dataToUpdate.INCIName.name,
        },
      };
    }

    return dataToUpdateResponse;
  }

  async deleteAllOils(): Promise<string> {
    try {
      const { count } = await this.prismaService.oil.deleteMany();
      if (!count || count === 0) {
        return 'No oils to delete';
      }
      return `Successfully deleted ${count} oils`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
