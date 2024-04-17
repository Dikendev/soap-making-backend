import { Injectable } from '@nestjs/common';
import { TranslateRepository } from '../../repository/translate-repository';
import { GoogleTranslateService } from '../../../external/translation/google-translate.service';

@Injectable()
export class TranslateService implements TranslateRepository {
  constructor(
    private readonly googleTranslateService: GoogleTranslateService,
  ) {}

  async translate(
    text: string,
    fromLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    return this.googleTranslateService.translate(
      text,
      fromLanguage,
      targetLanguage,
    );
  }
}
