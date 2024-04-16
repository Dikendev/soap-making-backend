import * as cheerio from 'cheerio';
import Axios from 'axios';
import { Injectable } from '@nestjs/common';
import { TranslateService } from '../translation/translate.service';

export interface SaponificationTable {
  [title: string]: Content;
}

export interface Content {
  SAP: string;
  NAOH: number;
  KOH: number;
  INCIName: string;
}

@Injectable()
export class CheerioService {
  url = 'https://www.fromnaturewithlove.com/resources/sapon.asp';

  constructor(private readonly translateService: TranslateService) {}

  async fetchData(): Promise<SaponificationTable> {
    try {
      const title = [];
      const response = await Axios.get(this.url);
      const $ = cheerio.load(response.data);

      const table = $('table');
      const tr = table.find('th');

      tr.each((_, row) => {
        title.push($(row).text());
      });

      const tBody = table.find('tbody');

      const result: SaponificationTable = {};

      tBody.each((index, row) => {
        if (index === 0) {
          const content = $(row).find('tr');
          content.find('tr').each((index, row) => {
            const td = $(row).find('td');

            const { keyTitle, data } = this.resolveData(td, $, result);

            if (keyTitle !== null) {
              result[keyTitle] = data;
            }
          });
        }
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  resolveData(
    td: cheerio.Cheerio<cheerio.Element>,
    $: cheerio.CheerioAPI,
    result: SaponificationTable,
  ): { keyTitle: string; data: Content } {
    let keyTitle: string = null;
    const data = this.bundleEmptyData();

    td.each((index, row2) => {
      const rowContent = $(row2).text();
      switch (index) {
        case 0:
          keyTitle = $(row2).text();
          if (!result[keyTitle]) {
            this.setKeyTitle(result, keyTitle);
          }
          break;
        case 1:
          data.SAP = rowContent.trim().length > 0 ? rowContent : null;
          break;
        case 2:
          data.NAOH = this.parseValues(rowContent);
          break;
        case 3:
          data.KOH = this.parseValues(rowContent);
          break;
        case 4:
          data.INCIName = rowContent.trim().length > 0 ? rowContent : null;
          break;
      }
    });

    return { keyTitle, data };
  }

  bundleEmptyData(): Content {
    return {
      SAP: null,
      NAOH: null,
      KOH: null,
      INCIName: null,
    };
  }

  parseValues(stringValue: string): number | null {
    return parseFloat(stringValue) || null;
  }

  setKeyTitle(
    result: SaponificationTable,
    keyTitle: string,
  ): SaponificationTable {
    return (result[keyTitle] = {
      SAP: null,
      NAOH: null,
      KOH: null,
      INCIName: null,
    });
  }
}
