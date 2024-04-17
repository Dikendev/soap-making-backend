export abstract class OilRepository {
  abstract createOil: (oil: any) => Promise<any>;
  abstract getOils: () => Promise<any>;
}
