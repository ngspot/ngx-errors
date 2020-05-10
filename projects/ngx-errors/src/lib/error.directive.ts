import { ChangeDetectorRef, Directive, Optional } from '@angular/core';
import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { ErrorBase } from './error.base';

/**
 * Directive to provide a validation error for a specific error name.
 * Used as a child of ngxErrors directive.
 *
 * Example:
 * ```html
 * <div [ngxErrors]="control">
 *   <div ngxError="required">This input is required</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[ngxError]',
})
export class ErrorDirective extends ErrorBase {
  constructor(
    cdr: ChangeDetectorRef,
    // ErrorsDirective is actually required.
    // use @Optional so that we can throw a custom error
    @Optional() errorsDirective: ErrorsDirective,
    @Optional() config: ErrorsConfiguration
  ) {
    super(cdr, errorsDirective, config);
  }
}
