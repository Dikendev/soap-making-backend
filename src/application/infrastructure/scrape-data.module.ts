import { Module } from '@nestjs/common';
import { PrismaModule } from '../../external/prisma/prisma.module';
import { ScrapeDataService } from '../ports/services/scrape-data.service';
import { ScrapeDataRepository } from '../repository/scrape-data.repository';
import { ScrapeDataController } from '../ports/controllers/scrape-data.controller';
import { TranslateModule } from './translate.module';

@Module({
  imports: [PrismaModule, TranslateModule],
  providers: [
    ScrapeDataService,
    { provide: ScrapeDataRepository, useClass: ScrapeDataService },
  ],
  controllers: [ScrapeDataController],
  exports: [ScrapeDataRepository],
})
export class ScrapeDataModule {}
