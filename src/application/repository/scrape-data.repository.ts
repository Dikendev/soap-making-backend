import { SaponificationTable } from '../ports/services/scrape-data.service';

export abstract class ScrapeDataRepository {
  abstract fetchData: () => Promise<any>;

  abstract translateScrapedData: (
    fromLanguage: string,
    targetLanguage: string,
  ) => Promise<SaponificationTable>;
}
