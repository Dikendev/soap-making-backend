import { SaponificationTable } from '../ports/services/interfaces/scrape-data.interface';

export abstract class ScrapeDataRepository {
  abstract fetchData: () => Promise<any>;

  abstract translateScrapedData: (
    fromLanguage: string,
    targetLanguage: string,
  ) => Promise<SaponificationTable>;
}
