import { Module } from '@nestjs/common';
import { CheerioRepository } from './cheerio.repository';
import { CheerioService } from './cheerio.service';
import { TranslateModule } from '../translation/translate.module';

@Module({
  imports: [TranslateModule],
  providers: [
    CheerioService,
    { provide: CheerioRepository, useClass: CheerioService },
  ],
  controllers: [],
  exports: [CheerioRepository],
})
export class CheerioModule {}
