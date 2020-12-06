import { AbstractControl } from '@angular/forms';
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
