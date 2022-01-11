import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OverriddenShowWhen {
  controlOverridden$ = new Subject<AbstractControl>();

  private controls = new Map<AbstractControl, string[]>();

  get(control: AbstractControl) {
    return this.controls.get(control);
  }

  add(control: AbstractControl) {
    this.controls.set(control, []);
    this.controlOverridden$.next(control);
  }

  errorVisibilityChanged(
    control: AbstractControl,
    errorName: string,
    showWhen: string,
    isVisible: boolean
  ) {
    const errorsShown = this.controls.get(control);

    if (!errorsShown) {
      return;
    }

    const key = `${errorName}-${showWhen}`;

    if (isVisible && !errorsShown.includes(key)) {
      const newErrorNamesShown = [...errorsShown, key];
      this.controls.set(control, newErrorNamesShown);
    }

    if (!isVisible && errorsShown.includes(key)) {
      const newErrorNamesShown = errorsShown.filter((name) => name !== key);
      this.controls.set(control, newErrorNamesShown);
    }

    this.controlOverridden$.next(control);
  }
}
