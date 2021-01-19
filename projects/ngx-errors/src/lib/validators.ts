import { isDevMode } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface DependentValidatorOptions<T> {
  /**
   * Function that returns AbstractControl to watch
   * @param form - the root FormGroup of the control being validated
   */
  watchControl: (form?: AbstractControl) => AbstractControl;
  /**
   * @param watchControlValue - the value of the control being watched
   * @returns ValidatorFn. Ex: Validators.required
   */
  validator: (watchControlValue?: T) => ValidatorFn;
  /**
   * If the condition is provided, it must return true in order for the
   * validator to be applied.
   * @param watchControlValue - the value of the control being watched
   */
  condition?: (watchControlValue?: T) => boolean;
}

/**
 * Makes it easy to trigger validation on the control, that depends on
 * a value of a different control
 */
export function dependentValidator<T = any>(
  opts: DependentValidatorOptions<T>
) {
  let subscribed = false;

  return (formControl: AbstractControl) => {
    const form = formControl.root;
    const { watchControl, condition, validator } = opts;
    const controlToWatch = watchControl(form);

    if (!controlToWatch) {
      if (isDevMode()) {
        console.warn(
          `dependentValidator could not find specified watchControl`
        );
      }
      return null;
    }

    if (!subscribed) {
      subscribed = true;

      controlToWatch.valueChanges.subscribe(() => {
        formControl.updateValueAndValidity();
      });
    }

    if (condition === undefined || condition(controlToWatch.value)) {
      const validatorFn = validator(controlToWatch.value);
      return validatorFn(formControl);
    }

    return null;
  };
}
