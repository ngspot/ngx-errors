import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  CustomErrorStateMatchers,
  CUSTOM_ERROR_STATE_MATCHERS,
} from './custom-error-state-matchers';

@Injectable({ providedIn: 'root' })
export class ErrorStateMatchers {
  private matchers: { [key: string]: ErrorStateMatcher } = {};

  constructor(
    showOnTouchedErrorStateMatcher: ShowOnTouchedErrorStateMatcher,
    showOnDirtyErrorStateMatcher: ShowOnDirtyErrorStateMatcher,
    showOnTouchedAndDirtyErrorStateMatcher: ShowOnTouchedAndDirtyErrorStateMatcher,
    showOnSubmittedErrorStateMatcher: ShowOnSubmittedErrorStateMatcher,
    @Optional()
    @Inject(CUSTOM_ERROR_STATE_MATCHERS)
    customErrorStateMatchers: CustomErrorStateMatchers
  ) {
    this.matchers['touched'] = showOnTouchedErrorStateMatcher;
    this.matchers['dirty'] = showOnDirtyErrorStateMatcher;
    this.matchers['touchedAndDirty'] = showOnTouchedAndDirtyErrorStateMatcher;
    this.matchers['formIsSubmitted'] = showOnSubmittedErrorStateMatcher;
    if (customErrorStateMatchers) {
      this.matchers = { ...this.matchers, ...customErrorStateMatchers };
    }
  }

  get(showWhen: string): ErrorStateMatcher | undefined {
    return this.matchers[showWhen];
  }

  validKeys(): string[] {
    return Object.keys(this.matchers);
  }
}

@Injectable()
export class ShowOnTouchedErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.touched || (form && form.submitted))
    );
  }
}

@Injectable()
export class ShowOnTouchedAndDirtyErrorStateMatcher
  implements ErrorStateMatcher
{
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      ((control.dirty && control.touched) || (form && form.submitted))
    );
  }
}

@Injectable()
export class ShowOnSubmittedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form && form.submitted);
  }
}
