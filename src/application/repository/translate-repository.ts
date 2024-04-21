export abstract class TranslateRepository {
  abstract translate: (text: string, targetLanguage: string) => Promise<string>;
}
