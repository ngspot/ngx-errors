import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
