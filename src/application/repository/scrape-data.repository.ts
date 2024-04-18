import {
  SaponificationTable,
  SaponificationTableArray,
} from '../ports/services/interfaces/scrape-data.interface';

export abstract class ScrapeDataRepository {
  abstract fetchData: () => Promise<any>;

  abstract translateScrapedData: (
    fromLanguage: string,
    targetLanguage: string,
  ) => Promise<SaponificationTableArray[] | SaponificationTable>;
}
