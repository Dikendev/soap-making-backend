import { SaponificationTable } from './cheerio.service';

export abstract class CheerioRepository {
  abstract fetchData: () => Promise<SaponificationTable>;
}
