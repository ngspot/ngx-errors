import { InjectionToken } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

export interface IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean;
}

export type CustomErrorStateMatchers = { [key: string]: IErrorStateMatcher };

/**
 * Provides a way to add to available options for when to display an error for
 * an invalid control. Options that come by default are
 * `'touched'`, `'dirty'`, `'touchedAndDirty'`, `'formIsSubmitted'`.
 */
export const CUSTOM_ERROR_STATE_MATCHERS =
  new InjectionToken<CustomErrorStateMatchers>('CUSTOM_ERROR_STATE_MATCHERS');
