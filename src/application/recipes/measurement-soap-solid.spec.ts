import { MeasurementSoapSolid } from './recipes';

describe('MeasurementSoapSolid', () => {
  let measurementSoapSolid: MeasurementSoapSolid;
  beforeEach(() => {
    measurementSoapSolid = new MeasurementSoapSolid();
  });

  it('should measurementSoapSolid to be defined', () => {
    expect(measurementSoapSolid).toBeDefined();
  });

  it('should return the correct amount of lye', () => {
    const oilWeight = 32;
    const result = measurementSoapSolid.recipeLyeAmount(oilWeight);
    console.log(result);

    const lyeOunces = 4.32;
    expect(result).toBe(lyeOunces);
  });
});
