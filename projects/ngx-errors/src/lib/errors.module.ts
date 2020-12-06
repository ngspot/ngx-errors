import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  IErrorsConfiguration,
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [ErrorsDirective, ErrorDirective],
  exports: [ErrorsDirective, ErrorDirective],
})
export class NgxErrorsModule {
  static configure(
    config?: IErrorsConfiguration
  ): ModuleWithProviders<NgxErrorsModule> {
    return {
      ngModule: NgxErrorsModule,
      providers: [
        {
          provide: ErrorsConfiguration,
          useValue: config,
        },
      ],
    };
  }
}
