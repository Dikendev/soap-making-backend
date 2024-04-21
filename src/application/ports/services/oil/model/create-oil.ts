import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export interface Name {
  language: string;
  name: string;
}

export interface OilModel {
  SAP: string;
  NAOH: number;
  KOH: number;
  name: string;
  translations?: Name[];
  INCIName?: Name[];
}

export class CreateOilDto implements OilModel {
  @IsNotEmpty()
  @IsString()
  SAP: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  NAOH: number;

  @IsNumber()
  @IsNumber()
  KOH: number;

  @IsOptional()
  @ValidateNested({ each: true })
  translations?: Name[];

  @IsOptional()
  @ValidateNested({ each: true })
  INCIName?: Name[];
}

export type OilsDto = CreateOilDto[];
