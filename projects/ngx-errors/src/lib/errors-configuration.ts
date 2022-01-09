import { Injectable } from '@angular/core';

/**
 * @deprecated
 * This type is deprecated and will be removed in a future version.
 * This was deprecated because library now provides a way to add additional
 * configurations with a user-chosen key that can be any string.
 */
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
  showErrorsWhenInput: string;
}

@Injectable()
export class ErrorsConfiguration implements IErrorsConfiguration {
  showErrorsWhenInput = 'touched';
}
