import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@ngspot/ngx-errors';

@Injectable({ providedIn: 'root' })
export class ShowOnDimaErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.value === 'dima');
  }
}
