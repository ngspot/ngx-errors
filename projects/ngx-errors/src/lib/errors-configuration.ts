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
   * Configures when to display an error for an invalid control. Options that are available by default are listed below. Note, custom options can be provided using CUSTOM_ERROR_STATE_MATCHERS injection token.
   *
   * `'touched'` - *[default]* shows an error when control is marked as touched. For example, user focused on the input and clicked away or tabbed through the input.
   *
   * `'dirty'` - shows an error when control is marked as dirty. For example, when user has typed something in.
   *
   * `'touchedAndDirty'` - shows an error when control is marked as both - touched and dirty.
   *
   * `'formIsSubmitted'` - shows an error when parent form was submitted.
   */
  showErrorsWhenInput?: string;

  /**
   * The maximum amount of errors to display per ngxErrors block.
   */
  showMaxErrors?: number;
}

@Injectable()
export class ErrorsConfiguration implements IErrorsConfiguration {
  showErrorsWhenInput = 'touched';
  showMaxErrors: number | undefined = undefined;
}
