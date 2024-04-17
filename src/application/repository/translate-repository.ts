export abstract class TranslateRepository {
  abstract translate: (
    text: string,
    fromLanguage: string,
    targetLanguage: string,
  ) => Promise<string>;
}
