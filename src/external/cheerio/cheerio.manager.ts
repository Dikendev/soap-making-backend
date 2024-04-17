import * as cheerio from 'cheerio';
import Axios from 'axios';

export class CheerioManager {
  constructor(public url: string) {}

  async initScrapeData(): Promise<cheerio.CheerioAPI> {
    try {
      const response = await Axios.get(this.url);
      return cheerio.load(response.data);
    } catch (error) {
      console.error(error);
    }
  }
}
