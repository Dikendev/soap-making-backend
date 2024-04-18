import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CheerioManager } from '../../../external/cheerio/cheerio.manager';
import { TranslateRepository } from '../../repository/translate-repository';
import {
  SaponificationTable,
  Content,
  SaponificationTableArray,
  INCIName,
} from './interfaces/scrape-data.interface';
import { ScrapeDataRepository } from '../../repository/scrape-data.repository';

const URL = 'https://www.fromnaturewithlove.com/resources/sapon.asp';

@Injectable()
export class ScrapeDataService implements ScrapeDataRepository {
  constructor(private readonly translateRepository: TranslateRepository) {}

  async fetchData(): Promise<SaponificationTable> {
    try {
      const title = [];

      const cheerioManager = new CheerioManager(URL);
      const $ = await cheerioManager.initScrapeData();

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
          content.find('tr').each((_, row) => {
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

  async translateScrapedData(
    fromLanguage: string,
    targetLanguage: string,
  ): Promise<SaponificationTableArray[] | SaponificationTable> {
    let isTranslateValues: boolean = true;

    if (fromLanguage === 'en' && targetLanguage === 'en') {
      isTranslateValues = false;
    }

    const englishResult = await this.fetchData();

    const keyTitle = Object.keys(englishResult);

    const data = await Promise.all(
      keyTitle.map(async (key) => {
        const inciName = englishResult[key].INCIName;
        let inciNameTranslated: string = null;
        let translatedKeys: string = key;

        if (inciName && isTranslateValues) {
          inciNameTranslated = await this.translateRepository.translate(
            inciName,
            fromLanguage,
            targetLanguage,
          );

          translatedKeys = await this.translateRepository.translate(
            key,
            fromLanguage,
            targetLanguage,
          );
        }

        return { translatedKeys, inciNameTranslated };
      }),
    );

    const translatedResult: SaponificationTableArray[] = [];
    for (let i = 0; i < keyTitle.length; i++) {
      const name = data[i].translatedKeys;
      const inciName = data[i].inciNameTranslated;
      const titleKey = keyTitle[i];
      const result = englishResult[titleKey];

      let INCIName: INCIName[] = [];

      if (inciName) {
        INCIName = [
          {
            language: targetLanguage,
            name: inciName,
          },
        ];
      }

      const names = [
        {
          language: targetLanguage,
          name,
        },
      ];

      translatedResult.push({
        ...result,
        names,
        INCIName,
      });
    }

    return translatedResult;
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
          data.SAP = this.trimString(rowContent);
          break;
        case 2:
          data.NAOH = this.parseStringToFloat(rowContent);
          break;
        case 3:
          data.KOH = this.parseStringToFloat(rowContent);
          break;
        case 4:
          data.INCIName = this.trimString(rowContent);
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

  trimString(stringValue: string): string {
    return stringValue.trim().length > 0 ? stringValue : null;
  }

  parseStringToFloat(stringValue: string): number | null {
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
