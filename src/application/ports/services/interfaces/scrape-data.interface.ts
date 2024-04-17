export interface SaponificationTable {
  [title: string]: Content;
}

export interface Content {
  SAP: string;
  NAOH: number;
  KOH: number;
  INCIName: string;
}
