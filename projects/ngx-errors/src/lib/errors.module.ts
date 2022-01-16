import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  ShowOnSubmittedErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnTouchedErrorStateMatcher,
} from './error-state-matchers';
import { ErrorStateMatchers } from './error-state-matchers.service';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  IErrorsConfiguration,
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { SetMatInputErrorStateMatcherDirective } from './set-mat-input-error-state-matcher.directive';

const declarationsAndExports = [
  ErrorsDirective,
  ErrorDirective,
  SetMatInputErrorStateMatcherDirective,
];

const defaultConfig: ErrorsConfiguration = {
  showErrorsWhenInput: 'touched',
  showMaxErrors: undefined,
};

function mergeErrorsConfiguration(
  config: IErrorsConfiguration
): ErrorsConfiguration {
  return { ...defaultConfig, ...config };
}

export const ERROR_STATE_MATCHER_PROVIDERS: Provider[] = [
  ErrorStateMatchers,
  ShowOnTouchedErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnSubmittedErrorStateMatcher,
];

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [...declarationsAndExports],
  exports: [...declarationsAndExports],
  providers: [ErrorsConfiguration, ...ERROR_STATE_MATCHER_PROVIDERS],
})
export class NgxErrorsModule {
  static configure(
    config: IErrorsConfiguration
  ): ModuleWithProviders<NgxErrorsModule> {
    return {
      ngModule: NgxErrorsModule,
      providers: [
        ...ERROR_STATE_MATCHER_PROVIDERS,
        {
          provide: ErrorsConfiguration,
          useValue: mergeErrorsConfiguration(config),
        },
        {
          provide: ErrorStateMatcher,
          useFactory: (
            errorsConfiguration: ErrorsConfiguration,
            errorStateMatchers: ErrorStateMatchers
          ) => {
            return errorStateMatchers.get(
              errorsConfiguration.showErrorsWhenInput
            );
          },
          deps: [ErrorsConfiguration, ErrorStateMatchers],
        },
      ],
    };
  }
}
