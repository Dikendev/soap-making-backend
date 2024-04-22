import { Controller, Get, Query } from '@nestjs/common';
import { MeasureSoapSolidRepository } from '../repository/measure-soap-solid-repository';
import { RecipeOptions } from '../use-case/generate-recipe-metric/measurement-soap-solid';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeOptionsQuery implements RecipeOptions {
  @IsNumber()
  waterAmountMultiplier: number;
}

export class RecipeQuery {
  @IsNotEmpty()
  lyeWeight: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecipeOptionsQuery)
  options!: {
    waterAmountMultiplier: number;
  };
}

@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly measureSoapSolidRepository: MeasureSoapSolidRepository,
  ) {}

  @Get('water')
  async recipeQuantityOfWater(@Query() recipeQuery: RecipeQuery) {
    console.log(recipeQuery);
    return this.measureSoapSolidRepository.recipeQuantityOfWater(
      recipeQuery.lyeWeight,
      recipeQuery.options,
    );
  }

  @Get('all-recipes')
  async getAllRecipes(): Promise<any> {
    return this.measureSoapSolidRepository.getAllRecipes();
  }
}
