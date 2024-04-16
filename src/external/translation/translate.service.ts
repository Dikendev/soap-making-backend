import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const translate = require('@iamtraction/google-translate');

@Injectable()
export class TranslateService {
  constructor() {}

  async translate(
    text: string,
    fromLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    const textTranslated = await translate(text, {
      from: fromLanguage,
      to: targetLanguage,
    });

    if (!textTranslated) {
      throw new Error('Error translating text');
    }

    return textTranslated.text;
  }
}
