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
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { ErrorsConfiguration } from './errors-configuration';
import { filterOutNullish } from './misc';
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
  exportAs: 'ngxErrors',
})
export class ErrorsDirective implements AfterViewInit {
  private control$$ = new BehaviorSubject<AbstractControl | undefined>(
    undefined
  );
  control$ = this.control$$.asObservable().pipe(filterOutNullish());

  @Input('ngxErrors') _control: AbstractControl | string;

  @Input() showWhen: string;

  private errorsCouldBeHidden$$ = new BehaviorSubject<Record<string, boolean>>(
    {}
  );

  private errorsVisibility$ = this.errorsCouldBeHidden$$.asObservable().pipe(
    map((errorsCouldBeHidden) => {
      const arr = [];
      let visibleCount = 0;
      for (const key in errorsCouldBeHidden) {
        if (errorsCouldBeHidden.hasOwnProperty(key)) {
          const errorCouldBeHidden = errorsCouldBeHidden[key];
          if (!errorCouldBeHidden) {
            visibleCount++;
          }

          const visible =
            !errorCouldBeHidden &&
            (!this.config.showMaxErrors ||
              visibleCount <= this.config.showMaxErrors);

          arr.push({ key, hidden: !visible });
        }
      }
      return arr;
    }),
    shareReplay(1)
  );

  constructor(
    @Optional() @SkipSelf() public parentForm: FormGroupDirective | null,
    @Optional() @SkipSelf() private parentFormGroupName: FormGroupName | null,
    private config: ErrorsConfiguration
  ) {}

  ngAfterViewInit() {
    this.initAndValidateDirective();
  }

  visibilityForKey$(key: string) {
    return this.errorsVisibility$.pipe(
      map((errors) => errors.find((error) => error.key === key)),
      filterOutNullish(),
      map((error) => error.hidden),
      distinctUntilChanged()
    );
  }

  visibilityChanged(errorName: string, showWhen: string, hidden: boolean) {
    const key = `${errorName}-${showWhen}`;
    const val = this.errorsCouldBeHidden$$.getValue();
    if (val[key] !== hidden) {
      const newVal = { ...val, [key]: hidden };
      this.errorsCouldBeHidden$$.next(newVal);
    }
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

      this.control$$.next(control);
      return;
    }

    if (!this.isAbstractControl(this._control)) {
      throw new ControlInstanceError();
    }

    this.control$$.next(this._control);
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
