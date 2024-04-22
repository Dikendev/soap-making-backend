import { Either, left, right } from '../../../../shared/either';
import { InvalidWaterAmountError } from '../../errors/invalid-water-amount';
import {
  WATER_AMOUNT_MULTIPLIER,
  WATER_AMOUNT_MIN_MULTIPLIER,
  WATER_MIN_MESSAGE_ERROR,
} from '../../recipe/recipe.const';

const WEIGHT_TYPE = {
  OUNCE: 'ounce',
  GRAMS: 'grams',
} as const;

export type WeightType = (typeof WEIGHT_TYPE)[keyof typeof WEIGHT_TYPE];

export interface RecipeOptions {
  waterAmountMultiplier: number;
}

export class MeasurementSoapSolid {
  constructor() {}

  recipeQuantityOfWater(
    lyeWeight: number,
    options?: RecipeOptions,
  ): Either<InvalidWaterAmountError, number> {
    const multiplier =
      options?.waterAmountMultiplier ?? WATER_AMOUNT_MULTIPLIER;

    if (multiplier < WATER_AMOUNT_MIN_MULTIPLIER) {
      return left(new InvalidWaterAmountError(WATER_MIN_MESSAGE_ERROR));
    }

    const waterAmount = lyeWeight * multiplier;
    return right(waterAmount);
  }
  //  Lye x 2.5 = H2O (water) amount

  recipeLyeAmount(oilWeight: number, weightType: WeightType): number {
    switch (weightType) {
      case WEIGHT_TYPE.GRAMS: {
        return oilWeight * 0.135;
      }
    }
  }

  // Example 1. If you are using 32 ounces of olive oil, multiply that amount by 0.135 (olive oil’s SAP value) to get 4.32 ounces of lye needed.
}
