import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface NameInput {
  language: string;
  name: string;
}

export interface INCINameInput {
  language: string;
  name: string;
}

export interface OilModel {
  SAP: string;
  NAOH: number;
  KOH: number;
  names?: NameInput[];
  INCIName?: INCINameInput[];
}

export class CreateOilDto implements OilModel {
  @IsNotEmpty()
  @IsString()
  SAP: string;

  @IsNotEmpty()
  @IsNumber()
  NAOH: number;

  @IsNumber()
  @IsNumber()
  KOH: number;

  @IsOptional()
  names?: NameInput[];

  @IsOptional()
  INCIName?: NameInput[];
}

export type OilsDto = CreateOilDto[];
