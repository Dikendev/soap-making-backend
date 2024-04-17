export abstract class ScrapeDataRepository {
  abstract fetchData: () => Promise<any>;
}
