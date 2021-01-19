import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { dependentValidator } from './validators';

function matchValidator<T>(compareVal: T): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors | null {
    return control.value === compareVal
      ? null
      : { match: { expected: compareVal, actual: control.value } };
  };
}

describe('dependentValidator', () => {
  let controlA: FormControl;
  let controlB: FormControl;

  let controlAValue: string;
  let controlBValue: string;

  // let matchValidatorSpy: jasmine.Spy<typeof matchValidator>;
  let condition: ((val?: any) => boolean) | undefined;

  Given(() => {
    controlAValue = '';
    controlBValue = '';
    condition = undefined;
    // matchValidatorSpy = jasmine.createSpy('matchValidator', matchValidator).and.callThrough();
  });

  When(() => {
    controlA = new FormControl(controlAValue);
    controlB = new FormControl(
      controlBValue,
      dependentValidator<string>({
        watchControl: () => controlA,
        validator: (val) => matchValidator(val),
        condition,
      })
    );
  });

  describe('controlA.value === controlB.value', () => {
    Given(() => (controlAValue = ''));
    Then('Control B is valid', () => expect(controlB.valid).toBe(true));
  });

  describe('controlA.value !== controlB.value', () => {
    Given(() => (controlAValue = 'asd'));
    Then('Control B is invalid', () => expect(controlB.valid).toBe(false));
  });

  describe('controlA.value !== controlB.value, then updated to match', () => {
    Given(() => {
      controlAValue = 'asd';
      controlBValue = 'qwe';
    });

    Then('Control B is valid', () => {
      controlA.setValue(controlBValue);
      expect(controlB.valid).toBe(true);
    });
  });

  describe('condition is provided', () => {
    describe('GIVEN: condition returns false', () => {
      Given(() => {
        controlAValue = 'not Dima';
        controlBValue = 'two';
        condition = (val) => val === 'Dima';
      });

      Then('Control B is valid', () => {
        expect(controlB.valid).toBe(true);
      });
    });

    describe('GIVEN: condition returns true', () => {
      Given(() => {
        controlAValue = 'Dima';
        controlBValue = 'two';
        condition = (val) => val === 'Dima';
      });

      Then('Control B is invalid', () => {
        expect(controlB.valid).toBe(false);
      });
    });
  });
});
