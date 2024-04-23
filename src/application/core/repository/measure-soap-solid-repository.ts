import { Either } from '../../../shared/either';
import { InvalidWaterAmountError } from '../errors/invalid-water-amount';
import {
  RecipeOptions,
  WeightType,
} from '../use-case/generate-recipe-metric/measurement-soap-solid';

export abstract class MeasureSoapSolidRepository {
  abstract recipeQuantityOfWater(
    lyeWeight: number,
    options?: RecipeOptions,
  ): Either<InvalidWaterAmountError, number>;
  abstract recipeLyeAmount(oilWeight: number, weightType: WeightType): number;
  abstract getAllRecipes(): Promise<any>;
}
