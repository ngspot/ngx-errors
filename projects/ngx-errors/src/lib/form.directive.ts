import { Directive, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';

@Directive({
  selector: 'form',
  exportAs: 'ngxErrorsForm',
})
export class NgxErrorsFormDirective {
  constructor(
    @Self() @Optional() private ngForm: NgForm | null,
    @Self() @Optional() private formGroupDirective: FormGroupDirective | null
  ) {}

  get form() {
    return this.ngForm ?? this.formGroupDirective;
  }
}
