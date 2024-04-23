import { DomainError } from '../../exceptions/domain-error.interface';

const ERROR_NAME = 'InvalidWaterAmountError';

export class InvalidWaterAmountError extends Error implements DomainError {
  constructor(public waterAmount: string) {
    super(`The water amount: ${waterAmount} is invalid`);
    this.name = ERROR_NAME;
  }
}
