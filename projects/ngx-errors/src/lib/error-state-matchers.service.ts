import { Inject, Injectable, Optional } from '@angular/core';
import {
  CustomErrorStateMatchers,
  CUSTOM_ERROR_STATE_MATCHERS,
  IErrorStateMatcher,
} from './custom-error-state-matchers';
import {
  ShowOnDirtyErrorStateMatcher,
  ShowOnSubmittedErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnTouchedErrorStateMatcher,
} from './error-state-matchers';

@Injectable()
export class ErrorStateMatchers {
  private matchers: { [key: string]: IErrorStateMatcher } = {};

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

  get(showWhen: string): IErrorStateMatcher | undefined {
    return this.matchers[showWhen];
  }

  validKeys(): string[] {
    return Object.keys(this.matchers);
  }
}
