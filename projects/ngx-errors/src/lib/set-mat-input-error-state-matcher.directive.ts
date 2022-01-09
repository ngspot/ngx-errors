import { Directive, OnDestroy, Self } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OverriddenShowWhen } from './overridden-show-when.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
})
export class SetMatInputErrorStateMatcherDirective implements OnDestroy {
  private subs = new Subscription();

  constructor(
    @Self() private matInput: MatInput,
    private overriddenShowWhen: OverriddenShowWhen
  ) {
    const control = this.matInput.ngControl.control;

    const sub = overriddenShowWhen.controlOverridden$
      .pipe(
        tap((controlOverridden) => {
          if (control === controlOverridden) {
            const errorNamesShown = this.overriddenShowWhen.get(
              control
            ) as string[];

            const errorStateMatcher: ErrorStateMatcher = {
              isErrorState: () => !!errorNamesShown.length,
            };
            this.matInput.errorStateMatcher = errorStateMatcher;
          }
        })
      )
      .subscribe();

    this.subs.add(sub);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
