import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, NEVER, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

const defaultConfig = new ErrorsConfiguration();

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
export class ErrorDirective implements AfterViewInit, OnDestroy {
  @HostBinding('hidden')
  hidden = true;

  @Input('ngxError') errorName: string;

  private destroy = new Subject();

  constructor(
    private cdr: ChangeDetectorRef,
    // ErrorsDirective is actually required.
    // use @Optional so that we can throw a custom error
    @Optional() private errorsDirective: ErrorsDirective,
    @Optional() private config: ErrorsConfiguration
  ) {
    this.initConfig();
  }

  ngAfterViewInit() {
    this.validateDirective();

    const ngSubmit$ =
      this.config.showErrorsWhenFormSubmitted && this.errorsDirective.parentForm
        ? this.errorsDirective.parentForm.ngSubmit
        : NEVER;

    this.errorsDirective.control$
      .pipe(
        takeUntil(this.destroy),
        filter((c): c is AbstractControl => !!c),
        tap((control) => this.calcShouldDisplay(control)),
        switchMap((control) =>
          merge(control.valueChanges, ngSubmit$).pipe(
            takeUntil(this.destroy),
            map(() => control)
          )
        ),
        tap((control) => this.calcShouldDisplay(control))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private calcShouldDisplay(control: AbstractControl) {
    const hasError = control.hasError(this.errorName);

    // could show error if there is one
    let couldShowError = false;

    const canShowBasedOnControlDirty = this.canShowBasedOnControlDirty(control);

    const form = this.errorsDirective.parentForm;

    if (form != null && form.submitted) {
      couldShowError =
        this.config.showErrorsWhenFormSubmitted || canShowBasedOnControlDirty;
    } else {
      couldShowError = canShowBasedOnControlDirty;
    }

    this.hidden = !(couldShowError && hasError);
    this.cdr.detectChanges();
  }

  private initConfig() {
    if (!this.config) {
      this.config = defaultConfig;
      return;
    }
    if (this.config.showErrorsOnlyIfInputDirty == null) {
      this.config.showErrorsOnlyIfInputDirty =
        defaultConfig.showErrorsOnlyIfInputDirty;
    }
    if (this.config.showErrorsWhenFormSubmitted == null) {
      this.config.showErrorsWhenFormSubmitted =
        defaultConfig.showErrorsWhenFormSubmitted;
    }
  }

  private validateDirective() {
    if (this.errorsDirective == null) {
      throw new NoParentNgxErrorsError();
    }

    if (typeof this.errorName !== 'string' || this.errorName.trim() === '') {
      throw new ValueMustBeStringError();
    }
  }

  private canShowBasedOnControlDirty(control: AbstractControl) {
    return !this.config.showErrorsOnlyIfInputDirty || control.dirty;
  }
}
