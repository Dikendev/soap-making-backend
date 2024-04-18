export interface SaponificationTable {
  [title: string]: Content;
}

export interface Content {
  SAP: string;
  NAOH: number;
  KOH: number;
  INCIName: string;
}

export interface SaponificationTableArray {
  SAP: string;
  NAOH: number;
  KOH: number;
  names: Name[];
  INCIName: INCIName[];
}

export interface INCIName {
  language: string;
  name: string;
}
export interface Name {
  language: string;
  name: string;
}
