export interface IErrorsConfiguration {
  /**
   * Configure errors to show only when the corresponding input is dirty.
   *
   * Default is `true`.
   */
  showErrorsOnlyIfInputDirty?: boolean;

  /**
   * Configure errors to show only when form is submitted.
   * Upon form submission shows errors even if `showErrorsOnlyIfInputDirty = true`
   * and some of the inputs aren't dirty.
   * Takes effect only when ngxErrors directive is a child of a form.
   *
   * Default is `false`.
   */
  showErrorsWhenFormSubmitted?: boolean;
}

export class ErrorsConfiguration implements IErrorsConfiguration {
  showErrorsOnlyIfInputDirty = true;
  showErrorsWhenFormSubmitted = false;
}
