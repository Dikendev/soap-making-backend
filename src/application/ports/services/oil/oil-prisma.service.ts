import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../external/prisma/prisma.service';
import { OilRepository } from '../../../repository/oil-repository';
import { CreateOilDto, OilResponse, OilsDto } from './model';

@Injectable()
export class OilPrismaService implements OilRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async registerOil(createOilDto: CreateOilDto): Promise<OilResponse> {
    try {
      const oilResponse = await this.prismaService.oil.create({
        data: {
          ...createOilDto,
          names: {
            create: createOilDto.names,
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
        include: { names: true, INCIName: true },
      });

      if (!oils.length) {
        throw new NotFoundException('No oils found');
      }

      return oils.map((oil) => new OilResponse(oil));
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
            names: {
              create: oil.names,
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
