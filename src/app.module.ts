import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './external/prisma/prisma.module';
import { OilModule } from './application/infrastructure/oil.module';
import { ScrapeDataModule } from './application/infrastructure/scrape-data.module';
import { GoogleTranslateModule } from './external/translation/google-translate.module';
import { TranslateModule } from './application/infrastructure/translate.module';

@Module({
  imports: [
    TranslateModule,
    PrismaModule,
    OilModule,
    ScrapeDataModule,
    GoogleTranslateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
