import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CheerioManager } from '../../../external/cheerio/cheerio.manager';
import { TranslateRepository } from '../../repository/translate-repository';

const URL = 'https://www.fromnaturewithlove.com/resources/sapon.asp';

export interface SaponificationTable {
  [title: string]: Content;
}

export interface Content {
  SAP: string[];
  NAOH: number;
  KOH: number;
  INCIName: string;
}

@Injectable()
export class ScrapeDataService {
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
  ): Promise<SaponificationTable> {
    const englishResult = await this.fetchData();
    const keyTitle = Object.keys(englishResult);

    const translatedKeys = await Promise.all(
      keyTitle.map((key) =>
        this.translateRepository.translate(key, fromLanguage, targetLanguage),
      ),
    );

    const translatedResult: SaponificationTable = {};
    for (let i = 0; i < keyTitle.length; i++) {
      const promise = translatedKeys[i];
      const titleKey = keyTitle[i];
      translatedResult[promise] = englishResult[titleKey];
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
          const rowArray: string[] = rowContent
            .replaceAll(/\s/g, '')
            .split('-');
          data.SAP = rowArray.length > 0 ? rowArray : null;
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
