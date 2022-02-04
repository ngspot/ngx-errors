import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { IErrorStateMatcher } from './custom-error-state-matchers';

@Injectable()
export class ShowOnTouchedErrorStateMatcher implements IErrorStateMatcher {
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
export class ShowOnDirtyErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.dirty || (form && form.submitted))
    );
  }
}

@Injectable()
export class ShowOnTouchedAndDirtyErrorStateMatcher
  implements IErrorStateMatcher
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
export class ShowOnSubmittedErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form && form.submitted);
  }
}
