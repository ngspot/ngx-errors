import {
  AfterViewInit,
  Directive,
  Input,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormGroupName,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  ControlInstanceError,
  ControlNotFoundError,
  NoControlError,
  ParentFormNotFoundError,
} from './ngx-errors';

/**
 * Directive to hook into the errors of a given control.
 *
 * Example:
 *
 * ```ts
 * \@Component({
 *   template: `
 *   <div [ngxErrors]="myControl">
 *     <div ngxError="required">This input is required</div>
 *   </div>
 *   `
 * })
 * export class MyComponent {
 *   myControl = new FormControl('', Validators.required)
 * }
 * ```
 * In case the `ngxErrors` directive is a child of a [formGroup], you can specify
 * the control by the control name similarly how you'd do it with formControlName:
 *
 * ```ts
 * \@Component({
 *   template: `
 *   <form [formGroup]="form">
 *     <div ngxErrors="firstName">
 *       <div ngxError="required">This input is required</div>
 *     </div>
 *   </form>
 *   `
 * })
 * export class MyComponent {
 *   form = this.fb.group({
 *     firstName: ['', Validators.required]
 *   });
 *   constructor(private fb: FormBuilder) {}
 * }
 * ```
 */
@Directive({
  selector: '[ngxErrors]',
})
export class ErrorsDirective implements AfterViewInit {
  control$ = new BehaviorSubject<AbstractControl | undefined>(undefined);

  @Input('ngxErrors') _control: AbstractControl | string;

  constructor(
    @Optional() @SkipSelf() public parentForm?: FormGroupDirective,
    @Optional() @SkipSelf() private parentFormGroupName?: FormGroupName
  ) {}

  ngAfterViewInit() {
    this.initAndValidateDirective();
  }

  private initAndValidateDirective() {
    if (!this._control) {
      throw new NoControlError();
    }

    if (typeof this._control === 'string') {
      if (!this.parentForm) {
        throw new ParentFormNotFoundError(this._control);
      }

      const control = !this.parentFormGroupName
        ? this.parentForm.form.get(this._control)
        : this.parentFormGroupName.control.get(this._control);

      if (control == null) {
        throw new ControlNotFoundError(this._control);
      }
      this.control$.next(control);
      return;
    }

    if (!this.isAbstractControl(this._control)) {
      throw new ControlInstanceError();
    }

    this.control$.next(this._control);
  }

  private isAbstractControl(
    control: AbstractControl | string
  ): control is AbstractControl {
    return (
      control instanceof FormControl ||
      control instanceof FormArray ||
      control instanceof FormGroup
    );
  }
}
