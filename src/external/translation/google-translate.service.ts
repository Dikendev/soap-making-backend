import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ENGLISH } from '../../application/ports/services/scrape-data.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const translate = require('@iamtraction/google-translate');

@Injectable()
export class GoogleTranslateService {
  async translate(text: string, targetLanguage: string): Promise<string> {
    const textTranslated = await translate(text, {
      from: ENGLISH,
      to: targetLanguage,
    });

    if (!textTranslated) {
      throw new HttpException(
        'Error translating text',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return textTranslated.text;
  }
}
