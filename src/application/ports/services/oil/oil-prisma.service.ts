import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../external/prisma/prisma.service';
import {
  FindOilByNameQuery,
  OilRepository,
} from '../../../repository/oil-repository';
import { CreateOilDto, Name, OilResponse, OilsDto } from './model';
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

  async findOilByName(
    findOilByNameQuery: FindOilByNameQuery,
  ): Promise<OilResponse> {
    const { name } = findOilByNameQuery;
    try {
      const uniqueOilResponse = await this.prismaService.oil.findUnique({
        where: { name: name },
        include: { translations: true, INCIName: true },
      });

      if (!uniqueOilResponse) {
        const translationOilName = await this.prismaService.oil.findFirst({
          where: { translations: { some: { name: { contains: name } } } },
          include: { translations: true, INCIName: true },
        });

        if (!translationOilName) {
          throw new NotFoundException('Oil not found');
        }

        return new OilResponse(translationOilName);
      }

      return new OilResponse(uniqueOilResponse);
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
          { name: oil.name },
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
    findOilByNameQuery: FindOilByNameQuery,
    dataToUpdate: DataToUpdate,
  ): Promise<OilResponse> {
    try {
      const foundOil = await this.prismaService.oil.findUnique({
        where: { name: findOilByNameQuery.name },
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

    if (!dataToUpdate.INCIName.language || !dataToUpdate.INCIName.name) {
      return dataToUpdateResponse;
    }

    const alreadyExistTranslations = oilResponse.translations.findIndex(
      (translation) => {
        return dataToUpdate.translations.language === translation.language;
      },
    );

    const alreadyExistINCIName = oilResponse.INCIName.findIndex((INCIName) => {
      return dataToUpdate.INCIName.language === INCIName.language;
    });

    if (alreadyExistTranslations === -1) {
      dataToUpdateResponse['translations'] = {
        create: {
          language: dataToUpdate.translations.language,
          name: dataToUpdate.translations.name,
        },
      };
    }

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
