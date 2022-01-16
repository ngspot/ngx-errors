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
import { merge, NEVER, Observable, of, Subscription, timer } from 'rxjs';
import { auditTime, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { ErrorStateMatchers } from './error-state-matchers.service';
import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { extractTouchedChanges } from './misc';
import {
  InvalidShowWhenError,
  NoParentNgxErrorsError,
  ValueMustBeStringError,
} from './ngx-errors';
import { OverriddenShowWhen } from './overridden-show-when.service';

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
  private subs = new Subscription();

  @HostBinding('hidden')
  hidden = true;

  @Input('ngxError') errorName: string;

  @Input() showWhen: string;

  err: any = {};

  constructor(
    private config: ErrorsConfiguration,
    private errorStateMatchers: ErrorStateMatchers,
    private overriddenShowWhen: OverriddenShowWhen,
    private cdr: ChangeDetectorRef,
    // ErrorsDirective is actually required.
    // use @Optional so that we can throw a custom error
    @Optional() private errorsDirective: ErrorsDirective
  ) {}

  ngAfterViewInit() {
    this.validateDirective();
    this.watchForEventsTriggeringVisibilityChange();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private watchForEventsTriggeringVisibilityChange() {
    const ngSubmit$ = this.errorsDirective.parentForm
      ? this.errorsDirective.parentForm.ngSubmit
      : NEVER;

    let touchedChanges$: Observable<boolean>;

    const sub = this.errorsDirective.control$
      .pipe(
        tap((control) => {
          this.initConfig(control);
          this.watchForVisibilityChange(control);
        }),
        tap((control) => {
          touchedChanges$ = extractTouchedChanges(control);
          this.calcShouldDisplay(control);
        }),
        switchMap((control) => {
          // https://github.com/angular/angular/issues/41519
          // control.statusChanges do not emit when there's async validator
          // ugly workaround:
          let asyncBugWorkaround$: Observable<any> = NEVER;
          if (control.asyncValidator && control.status === 'PENDING') {
            asyncBugWorkaround$ = timer(0, 50).pipe(
              switchMap(() => of(control.status)),
              filter((x) => x !== 'PENDING'),
              first()
            );
          }

          return merge(
            control.valueChanges,
            control.statusChanges,
            touchedChanges$,
            ngSubmit$,
            asyncBugWorkaround$
          ).pipe(
            auditTime(0),
            map(() => control)
          );
        }),
        tap((control) => {
          this.calcShouldDisplay(control);
        })
      )
      .subscribe();

    this.subs.add(sub);
  }

  private calcShouldDisplay(control: AbstractControl) {
    const hasError = control.hasError(this.errorName);

    const form = this.errorsDirective.parentForm;

    const errorStateMatcher = this.errorStateMatchers.get(this.showWhen);

    if (!errorStateMatcher) {
      throw new InvalidShowWhenError(
        this.showWhen,
        this.errorStateMatchers.validKeys()
      );
    }

    const hasErrorState = errorStateMatcher.isErrorState(control, form);

    const couldBeHidden = !(hasErrorState && hasError);

    this.errorsDirective.visibilityChanged(
      this.errorName,
      this.showWhen,
      couldBeHidden
    );
  }

  private watchForVisibilityChange(control: AbstractControl) {
    const key = `${this.errorName}-${this.showWhen}`;

    const sub = this.errorsDirective
      .visibilityForKey$(key)
      .pipe(
        tap((hidden) => {
          this.hidden = hidden;

          this.overriddenShowWhen.errorVisibilityChanged(
            control,
            this.errorName,
            this.showWhen,
            !this.hidden
          );

          this.err = control.getError(this.errorName) || {};

          this.cdr.detectChanges();
        })
      )
      .subscribe();

    this.subs.add(sub);
  }

  private initConfig(control: AbstractControl) {
    if (this.showWhen) {
      this.overriddenShowWhen.add(control);
      return;
    }

    if (this.errorsDirective.showWhen) {
      this.showWhen = this.errorsDirective.showWhen;
      this.overriddenShowWhen.add(control);
      return;
    }

    this.showWhen = this.config.showErrorsWhenInput;

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
