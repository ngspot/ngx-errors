import {
  AfterViewInit,
  ChangeDetectorRef,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, NEVER, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

export const defaultConfig = new ErrorsConfiguration();

export class ErrorBase implements AfterViewInit, OnDestroy {
  @HostBinding('hidden')
  hidden = true;

  @Input('ngxError') errorName: string;

  private destroy = new Subject();

  constructor(
    private cdr: ChangeDetectorRef,
    private errorsDirective: ErrorsDirective,
    private config: ErrorsConfiguration
  ) {
    this.initConfig();
  }

  ngAfterViewInit() {
    this.validateDirective();
    this.listenForm();
  }

  listenForm(): void {
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
    if (this.config.showErrorsWhenFormSubmitted) {
      couldShowError = form ? form.submitted : canShowBasedOnControlDirty;
    } else {
      couldShowError = canShowBasedOnControlDirty;
    }

    this.changeErrorVisibility(
      couldShowError && hasError && control.getError(this.errorName)
    );
    this.cdr.detectChanges();
  }

  changeErrorVisibility(error: any): void {
    this.hidden = !error;
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
