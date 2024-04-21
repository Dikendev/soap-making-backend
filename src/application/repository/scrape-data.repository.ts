import { OilResponse } from '../ports/services/oil/model';

export abstract class ScrapeDataRepository {
  abstract fetchData: () => Promise<any>;

  abstract translateScrapedData: (
    targetLanguage: string,
  ) => Promise<OilResponse[]>;
}
