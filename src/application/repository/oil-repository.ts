import { OilResponse, OilsDto } from '../ports/services/oil/model';

export abstract class OilRepository {
  abstract registerOil: (oil: any) => Promise<OilResponse>;
  abstract findOils: () => Promise<OilResponse[]>;
  abstract registerManyOils: (oils: OilsDto) => Promise<string>;
  abstract deleteAllOils: () => Promise<string>;
}
