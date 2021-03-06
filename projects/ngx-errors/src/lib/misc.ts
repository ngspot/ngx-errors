import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

/**
 * Extract arguments of function
 */
export type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

/**
 * Creates an object like O. Optionally provide minimum set of properties P which the objects must share to conform
 */
type ObjectLike<O extends object, P extends keyof O = keyof O> = Pick<O, P>;

/**
 * Extract a touched changed observable from an abstract control
 * @param control AbstractControl like object with markAsTouched method
 *
 * @usage
 * ```
 * const formControl = new FormControl();
 * const touchedChanged$ = extractTouchedChanges(formControl);
 * ```
 */
export const extractTouchedChanges = (
  control: ObjectLike<AbstractControl, 'markAsTouched' | 'markAsUntouched'>
): Observable<boolean> => {
  const prevMarkAsTouched = control.markAsTouched;
  const prevMarkAsUntouched = control.markAsUntouched;

  const touchedChanges$ = new Subject<boolean>();

  function nextMarkAsTouched(
    ...args: ArgumentsType<AbstractControl['markAsTouched']>
  ) {
    touchedChanges$.next(true);
    prevMarkAsTouched.bind(control)(...args);
  }

  function nextMarkAsUntouched(
    ...args: ArgumentsType<AbstractControl['markAsUntouched']>
  ) {
    touchedChanges$.next(false);
    prevMarkAsUntouched.bind(control)(...args);
  }

  control.markAsTouched = nextMarkAsTouched;
  control.markAsUntouched = nextMarkAsUntouched;

  return touchedChanges$.asObservable();
};

/**
 * Marks the provided control as well as all of its children as dirty
 * @param options to be passed into control.markAsDirty() call
 */
export function markDescendantsAsDirty(
  control: AbstractControl,
  options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }
) {
  control.markAsDirty(options);

  if (control instanceof FormGroup || control instanceof FormArray) {
    let controls = Object.keys(control.controls).map(
      (controlName) => control.get(controlName)!
    );

    controls.forEach((control) => {
      control.markAsDirty(options);

      if ((control as FormGroup | FormArray).controls) {
        markDescendantsAsDirty(control, options);
      }
    });
  }
}
