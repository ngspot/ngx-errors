import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorsDirective } from './errors.directive';
import { ErrorDirective } from './error.directive';
import {
  IErrorsConfiguration,
  ErrorsConfiguration,
} from './errors-configuration';
import { RichErrorDirective } from './rich-error.directive';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [ErrorsDirective, ErrorDirective, RichErrorDirective],
  exports: [ErrorsDirective, ErrorDirective, RichErrorDirective],
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
