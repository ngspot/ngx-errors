import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { IErrorStateMatcher } from '@ngspot/ngx-errors';

@Injectable({ providedIn: 'root' })
export class ShowOnDimaErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.value === 'dima');
  }
}
