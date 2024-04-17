import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../external/prisma/prisma.service';
import { OilRepository } from '../../repository/oil-repository';

@Injectable()
export class OilPrismaService implements OilRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOil(oil: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getOils(): Promise<any> {
    const oils = await this.prismaService.oil.findMany();

    if (!oils.length) throw new NotFoundException('No oils found');

    return oils;
  }
}
