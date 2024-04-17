import { Module } from '@nestjs/common';
import { TranslateService } from '../ports/services/translate.service';
import { TranslateRepository } from '../repository/translate-repository';
import { GoogleTranslateModule } from '../../external/translation/google-translate.module';

@Module({
  imports: [GoogleTranslateModule],
  providers: [
    TranslateService,
    { provide: TranslateRepository, useClass: TranslateService },
  ],
  controllers: [],
  exports: [TranslateRepository],
})
export class TranslateModule {}
