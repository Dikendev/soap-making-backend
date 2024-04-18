import { Module } from '@nestjs/common';
import { OilPrismaService } from '../ports/services/oil/oil-prisma.service';
import { OilRepository } from '../repository/oil-repository';
import { OilController } from '../ports/controllers/oil.controller';
import { PrismaModule } from '../../external/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    OilPrismaService,
    { provide: OilRepository, useClass: OilPrismaService },
  ],
  controllers: [OilController],
  exports: [OilRepository],
})
export class OilModule {}
