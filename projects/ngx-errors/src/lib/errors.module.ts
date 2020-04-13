import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorsDirective } from './errors.directive';
import { ErrorDirective } from './error.directive';
import {
  IErrorsConfiguration,
  ErrorsConfiguration,
} from './errors-configuration';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [ErrorsDirective, ErrorDirective],
  exports: [ErrorsDirective, ErrorDirective],
})
export class NgxErrorsModule {
  static configure(
    config: IErrorsConfiguration
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
