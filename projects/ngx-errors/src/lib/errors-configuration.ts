import { Injectable } from '@angular/core';

export type ShowErrorWhen =
  | 'touched'
  | 'dirty'
  | 'touchedAndDirty'
  | 'formIsSubmitted';

export interface IErrorsConfiguration {
  /**
   * Configures when to display an error for an invalid control. Available options are:
   *
   * `'touched'` - *[default]* shows an error when control is marked as touched. For example, user focused on the input and clicked away or tabbed through the input.
   *
   * `'dirty'` - shows an error when control is marked as dirty. For example, when user has typed something in.
   *
   * `'touchedAndDirty'` - shows an error when control is marked as both - touched and dirty.
   *
   * `'formIsSubmitted'` - shows an error when parent form was submitted.
   */
  showErrorsWhenInput: ShowErrorWhen;
}

@Injectable()
export class ErrorsConfiguration implements IErrorsConfiguration {
  showErrorsWhenInput = 'touched' as ShowErrorWhen;
}
