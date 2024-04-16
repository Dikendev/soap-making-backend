import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheerioModule } from './external/cheerio/cheerio.module';
import { TranslateModule } from './external/translation/translate.module';

@Module({
  imports: [CheerioModule, TranslateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
