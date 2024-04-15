import {
  WATER_AMOUNT_MIN_MULTIPLIER,
  WATER_AMOUNT_MULTIPLIER,
  WATER_MIN_MESSAGE_ERROR,
} from './recipe.const';

const WEIGHT_TYPE = {
  OUNCE: 'ounce',
  GRAMS: 'grams',
} as const;

type WeightType = (typeof WEIGHT_TYPE)[keyof typeof WEIGHT_TYPE];

export class MeasurementSoapSolid {
  constructor() {}

  recipeQuantityOfWater(
    lye: number,
    options?: { waterAmountMultiplier: number },
  ): number {
    if (!options.waterAmountMultiplier) {
      return lye * WATER_AMOUNT_MULTIPLIER;
    }

    if (options.waterAmountMultiplier < WATER_AMOUNT_MIN_MULTIPLIER) {
      throw new Error(WATER_MIN_MESSAGE_ERROR);
    }

    return lye * options.waterAmountMultiplier;
  }
  //  Lye x 2.5 = H2O.

  recipeLyeAmount(oilWeight: number, weightType: WeightType): number {
    switch (weightType) {
      case WEIGHT_TYPE.GRAMS: {
        return oilWeight * 0.135;
      }
    }
  }

  // Example 1. If you are using 32 ounces of olive oil, multiply that amount by 0.135 (olive oil’s SAP value) to get 4.32 ounces of lye needed.
}
