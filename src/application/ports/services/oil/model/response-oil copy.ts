import { INCINameInput, NameInput, OilModel } from './create-oil';

export class OilResponse implements OilModel {
  SAP: string;
  NAOH: number;
  KOH: number;
  names?: NameInput[];
  INCIName?: INCINameInput[];

  constructor(oil: OilModel) {
    this.SAP = oil.SAP;
    this.NAOH = oil.NAOH;
    this.KOH = oil.KOH;
    this.names = oil.names;
    this.INCIName = oil.INCIName;
  }
}
