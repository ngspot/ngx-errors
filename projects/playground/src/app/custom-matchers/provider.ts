import { Provider } from '@angular/core';
import { CUSTOM_ERROR_STATE_MATCHERS } from '@ngspot/ngx-errors';
import { ShowOnDimaErrorStateMatcher } from './show-on-dima-error-state-matcher';
import { ShowOnFiveErrorStateMatcher } from './show-on-five-error-state-matcher';

export const CUSTOM_ERROR_STATE_MATCHERS_PROVIDER: Provider = {
  provide: CUSTOM_ERROR_STATE_MATCHERS,
  useFactory: (
    showOnDirtyErrorStateMatcher: ShowOnDimaErrorStateMatcher,
    showOnFiveErrorStateMatcher: ShowOnFiveErrorStateMatcher
  ) => {
    return {
      dima: showOnDirtyErrorStateMatcher,
      five: showOnFiveErrorStateMatcher,
    };
  },
  deps: [ShowOnDimaErrorStateMatcher, ShowOnFiveErrorStateMatcher],
};
