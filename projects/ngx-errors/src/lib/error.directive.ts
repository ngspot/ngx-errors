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
import { merge, NEVER, Observable, Subject } from 'rxjs';
import {
  auditTime,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ErrorsConfiguration, ShowErrorWhen } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { extractTouchedChanges } from './misc';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

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
  exportAs: 'ngxError',
})
export class ErrorDirective implements AfterViewInit, OnDestroy {
  private destroy = new Subject();

  @HostBinding('hidden')
  hidden = true;

  @Input('ngxError') errorName: string;

  @Input() showWhen: ShowErrorWhen;

  err: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    // ErrorsDirective is actually required.
    // use @Optional so that we can throw a custom error
    @Optional() private errorsDirective: ErrorsDirective,
    @Optional() private config: ErrorsConfiguration
  ) {}

  ngAfterViewInit() {
    this.validateDirective();

    const ngSubmit$ = this.errorsDirective.parentForm
      ? this.errorsDirective.parentForm.ngSubmit
      : NEVER;

    let touchedChanges$: Observable<boolean>;

    this.errorsDirective.control$
      .pipe(
        takeUntil(this.destroy),
        filter((c): c is AbstractControl => !!c),
        tap(() => {
          this.initConfig();
        }),
        tap((control) => {
          touchedChanges$ = extractTouchedChanges(control);
          this.calcShouldDisplay(control);
        }),
        switchMap((control) =>
          merge(
            control.valueChanges,
            control.statusChanges,
            touchedChanges$,
            ngSubmit$
          ).pipe(
            auditTime(0),
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

    const form = this.errorsDirective.parentForm;

    if (form != null && form.submitted) {
      couldShowError = true;
    } else {
      if (
        this.showWhen === 'touchedAndDirty' &&
        control.dirty &&
        control.touched
      ) {
        couldShowError = true;
      }

      if (this.showWhen === 'dirty' && control.dirty) {
        couldShowError = true;
      }

      if (this.showWhen === 'touched' && control.touched) {
        couldShowError = true;
      }
    }

    this.hidden = !(couldShowError && hasError);

    this.err = control.getError(this.errorName) || {};

    this.cdr.detectChanges();
  }

  private initConfig() {
    if (this.showWhen) {
      return;
    }

    if (this.errorsDirective.showWhen) {
      this.showWhen = this.errorsDirective.showWhen;
      return;
    }

    this.showWhen = this.config ? this.config.showErrorsWhenInput : 'touched';

    if (
      this.showWhen === 'formIsSubmitted' &&
      !this.errorsDirective.parentForm
    ) {
      this.showWhen = 'touched';
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
}
