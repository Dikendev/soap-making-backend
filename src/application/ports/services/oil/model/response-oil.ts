import { Name, OilModel } from './create-oil';

export class OilResponse implements OilModel {
  SAP: string;
  NAOH: number;
  KOH: number;
  name: string;
  translations?: Name[];
  INCIName?: Name[];

  constructor(oil: OilModel) {
    this.SAP = oil.SAP;
    this.NAOH = oil.NAOH;
    this.KOH = oil.KOH;
    this.name = oil.name;
    this.translations = oil.translations;
    this.INCIName = oil.INCIName;
  }
}
