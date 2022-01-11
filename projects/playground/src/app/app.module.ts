import { Injectable, NgModule } from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CUSTOM_ERROR_STATE_MATCHERS,
  ErrorStateMatcher,
  NgxErrorsModule,
} from '@ngspot/ngx-errors';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@Injectable({ providedIn: 'root' })
export class ShowOnDimaErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.value === 'dima');
  }
}

@Injectable({ providedIn: 'root' })
export class ShowOnFiveErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.value && control.value.length === 5);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    NgxErrorsModule.configure({
      showErrorsWhenInput: 'dima',
    }),
  ],
  declarations: [AppComponent, HomeComponent],
  providers: [
    {
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
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
