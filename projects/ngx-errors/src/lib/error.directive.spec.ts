import { ChangeDetectionStrategy } from '@angular/compiler';
import { Component, Input, Optional, Provider, ViewChild } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  NgModelGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import {
  ShowOnDirtyErrorStateMatcher,
  ShowOnSubmittedErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnTouchedErrorStateMatcher,
} from './error-state-matchers';
import { ErrorStateMatchers } from './error-state-matchers.service';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  IErrorsConfiguration,
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { NgxErrorsFormDirective } from './form.directive';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

const myAsyncValidator: AsyncValidatorFn = (c: AbstractControl) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (c.value !== '123') {
        resolve({ isNot123: true });
      } else {
        resolve(null);
      }
    }, 50);
  });
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  @ViewChild(NgForm) ngForm: NgForm;

  validInitialVal = new FormControl('val', Validators.required);
  invalidInitialVal = new FormControl('', Validators.required);
  multipleErrors = new FormControl('123456', [
    Validators.minLength(10),
    Validators.maxLength(3),
  ]);

  form = new FormGroup({
    validInitialVal: new FormControl('val', Validators.required),
    invalidInitialVal: new FormControl(3, Validators.min(10)),
    withAsyncValidator: new FormControl('', {
      asyncValidators: myAsyncValidator,
    }),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
    }),
  });

  addressModel = { street: '' };

  submit() {}
}

export const formViewProvider: Provider = {
  provide: ControlContainer,
  useFactory: _formViewProviderFactory,
  deps: [
    [new Optional(), NgForm],
    [new Optional(), NgModelGroup],
  ],
};

export function _formViewProviderFactory(
  ngForm: NgForm,
  ngModelGroup: NgModelGroup
) {
  return ngModelGroup || ngForm || null;
}

@Component({
  selector: 'app-test-child-address',
  template: `
    <input
      [(ngModel)]="address.street"
      required
      name="street"
      #street="ngModel"
    />
    <div [ngxErrors]="street.control">
      <div ngxError="required">Required</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
})
class TestChildComponent {
  @Input() address: { street: string };
}

describe(ErrorDirective.name, () => {
  const initialConfig: IErrorsConfiguration = {
    showErrorsWhenInput: 'touched',
  };

  const createDirective = createDirectiveFactory({
    directive: ErrorDirective,
    declarations: [ErrorsDirective, NgxErrorsFormDirective, TestChildComponent],
    imports: [ReactiveFormsModule, FormsModule],
    providers: [
      { provide: ErrorsConfiguration, useValue: initialConfig },
      ErrorStateMatchers,
      ShowOnTouchedErrorStateMatcher,
      ShowOnDirtyErrorStateMatcher,
      ShowOnTouchedAndDirtyErrorStateMatcher,
      ShowOnSubmittedErrorStateMatcher,
    ],
    host: TestHostComponent,
  });

  let template: string;
  let spectator: SpectatorDirective<ErrorDirective, TestHostComponent>;
  let showWhen: string;

  Given(() => (showWhen = undefined as any));

  function createDirectiveWithConfig(
    showErrorsWhenInput: string | undefined,
    showMaxErrors?: number
  ) {
    const config = new ErrorsConfiguration();
    if (showErrorsWhenInput) {
      config.showErrorsWhenInput = showErrorsWhenInput;
    }
    if (showMaxErrors !== undefined) {
      config.showMaxErrors = showMaxErrors;
    }
    spectator = createDirective(template, {
      providers: [
        {
          provide: ErrorsConfiguration,
          useValue: config,
        },
      ],
    });
  }

  function ThenErrorShouldBeVisible() {
    Then('Error should be visible', () =>
      expect(spectator.element).toBeVisible()
    );
  }

  function ThenErrorShouldBeHidden() {
    Then('Error should be hidden', () =>
      expect(spectator.element).toBeHidden()
    );
  }

  function ExpectErrorVisibilityForStates(opts: {
    expectedVisibility: boolean;
    forStates: string[];
  }) {
    opts.forStates.forEach((givenShowWhen) => {
      describe(`GIVEN: showWhen: ${givenShowWhen}`, () => {
        Given(() => (showWhen = givenShowWhen));
        opts.expectedVisibility
          ? ThenErrorShouldBeVisible()
          : ThenErrorShouldBeHidden();
      });
    });
  }

  it('should throw if no parent ngxErrors is found', () => {
    expect(() => {
      createDirective(`<div ngxError="required">Required</div>`);
    }).toThrow(new NoParentNgxErrorsError());
  });

  it('should throw if errorName is not provided', () => {
    expect(() => {
      createDirective(`
        <div [ngxErrors]="invalidInitialVal">
          <div ngxError>Required</div>
        </div>`);
    }).toThrow(new ValueMustBeStringError());
  });

  describe('PROP: showWhen', () => {
    let actual: string;

    When(() => {
      createDirectiveWithConfig(showWhen);
      actual = spectator.directive.showWhen;
    });

    describe('GIVEN: There is a parent formGroup', () => {
      describe('GIVEN: there is no override at the directive level', () => {
        Given(() => {
          template = `
            <div [formGroup]="form">
              <div [ngxErrors]="'invalidInitialVal'">
                <div ngxError="req"></div>
              </div>
            </div>`;
        });

        describe('GIVEN: config.showWhen = "touched"', () => {
          Given(() => (showWhen = 'touched'));
          Then('should be touched', () => expect('touched').toBe(actual));
        });

        describe('GIVEN: config.showWhen = "dirty"', () => {
          Given(() => (showWhen = 'dirty'));
          Then('should be dirty', () => expect('dirty').toBe(actual));
        });

        describe('GIVEN: config.showWhen = "touchedAndDirty"', () => {
          Given(() => (showWhen = 'touchedAndDirty'));
          Then('should be touchedAndDirty', () =>
            expect('touchedAndDirty').toBe(actual)
          );
        });

        describe('GIVEN: config.showWhen = "formIsSubmitted"', () => {
          Given(() => (showWhen = 'formIsSubmitted'));
          Then('should be formIsSubmitted', () =>
            expect('formIsSubmitted').toBe(actual)
          );
        });
      });

      describe('GIVEN: there is an override at the ngxErrors level', () => {
        Given(() => {
          showWhen = 'formIsSubmitted';
          template = `
            <form [formGroup]="form">
              <div ngxErrors="invalidInitialVal" showWhen="touched">
                <div ngxError="req"></div>
              </div>
            </form>`;
        });

        Then('should be formIsSubmitted', () => expect('touched').toBe(actual));
      });

      describe('GIVEN: there is an override at the ngxError level', () => {
        Given(() => {
          showWhen = 'formIsSubmitted';
          template = `
            <form [formGroup]="form">
              <div ngxErrors="invalidInitialVal">
                <div ngxError="req" showWhen="touched"></div>
              </div>
            </form>`;
        });

        Then('should be formIsSubmitted', () => expect('touched').toBe(actual));
      });
    });

    describe('GIVEN: There is no parent formGroup', () => {
      Given(() => {
        template = `
          <div [ngxErrors]="validInitialVal">
            <div ngxError="req"></div>
          </div>`;
      });

      describe('GIVEN: config.showWhen = "formIsSubmitted"', () => {
        Given(() => (showWhen = 'formIsSubmitted'));
        Then('should be overridden to touched', () =>
          expect('touched').toBe(actual)
        );
      });
    });
  });

  describe('TEST: initial visibility', () => {
    let testControl:
      | 'validInitialVal'
      | 'invalidInitialVal'
      | 'withAsyncValidator';

    When(() => {
      template = `
      <form [formGroup]="form">
        <div ngxErrors="${testControl}">
          <div ngxError="req"></div>
        </div>
      </form>`;
      createDirectiveWithConfig(showWhen);
    });

    describe('GIVEN: testControl is "validInitialVal"', () => {
      Given(() => (testControl = 'validInitialVal'));
      ExpectErrorVisibilityForStates({
        expectedVisibility: false,
        forStates: ['dirty', 'touched', 'touchedAndDirty', 'formIsSubmitted'],
      });
    });

    describe('GIVEN: testControl is "invalidInitialVal"', () => {
      Given(() => (testControl = 'invalidInitialVal'));
      ExpectErrorVisibilityForStates({
        expectedVisibility: false,
        forStates: ['dirty', 'touched', 'touchedAndDirty', 'formIsSubmitted'],
      });
    });

    describe('GIVEN: testControl is "withAsyncValidator"', () => {
      describe('initial', () => {
        Given(() => (testControl = 'withAsyncValidator'));
        ExpectErrorVisibilityForStates({
          expectedVisibility: false,
          forStates: ['dirty'],
        });
      });

      describe('after async validator was done', () => {
        it('should behave...', async () => {
          testControl = 'withAsyncValidator';

          template = `
          <form [formGroup]="form">
            <div ngxErrors="${testControl}">
              <div ngxError="isNot123"></div>
            </div>
          </form>`;
          createDirectiveWithConfig(showWhen);

          const c = spectator.hostComponent.form.get(testControl)!;
          c.markAsTouched();

          await wait(150);

          expect(spectator.element).toBeVisible();
        });
      });
    });
  });

  describe('TEST: limiting amount of visible ngxError', () => {
    let showMaxErrors: number;

    When(() => {
      template = `
        <ng-container [ngxErrors]="multipleErrors">
          <div ngxError="minlength">minlength</div>
          <div ngxError="maxlength">maxlength</div>
        </ng-container>`;
      createDirectiveWithConfig(showWhen, showMaxErrors);
      spectator.hostComponent.multipleErrors.markAsTouched();
      spectator.hostComponent.multipleErrors.markAsDirty();
    });

    describe('GIVEN: showMaxErrors is 1', () => {
      Given(() => {
        showMaxErrors = 1;
        showWhen = 'touched';
      });

      Then(async () => {
        await spectator.fixture.whenStable();
        const errors = spectator.queryAll('[ngxerror]:not([hidden])');
        expect(errors.length).toBe(1);
      });
    });
  });

  describe('TEST: submitting a form should display an error', () => {
    Given(() => {
      template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div ngxError="min"></div>
        </div>

        <button type="submit"></button>
      </form>`;
    });

    When(
      waitForAsync(() => {
        createDirectiveWithConfig(showWhen);
        spectator.click('button');
      })
    );

    ExpectErrorVisibilityForStates({
      expectedVisibility: true,
      forStates: ['dirty', 'touched', 'touchedAndDirty', 'formIsSubmitted'],
    });
  });

  describe('TEST: submitting a form with nested formGroup should display an error', () => {
    Given(() => {
      template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div [formGroup]="form.get('address')">
          <div ngxErrors="street">
            <div ngxError="required">Required</div>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>`;
    });

    When(
      waitForAsync(() => {
        createDirectiveWithConfig(showWhen);
        spectator.click('button');
      })
    );

    ExpectErrorVisibilityForStates({
      expectedVisibility: true,
      forStates: ['dirty', 'touched', 'touchedAndDirty', 'formIsSubmitted'],
    });
  });

  describe('TEST: visibility of error when interacting with an input', () => {
    Given(() => {
      template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="text" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div ngxError="min">min 10</div>
        </div>
      </form>`;
    });

    describe('WHEN: touch an input', () => {
      When(
        waitForAsync(() => {
          createDirectiveWithConfig(showWhen);
          spectator.focus('input');
          spectator.blur('input');
        })
      );

      ExpectErrorVisibilityForStates({
        expectedVisibility: true,
        forStates: ['touched'],
      });

      ExpectErrorVisibilityForStates({
        expectedVisibility: false,
        forStates: ['dirty', 'touchedAndDirty', 'formIsSubmitted'],
      });
    });

    describe('WHEN: type in the input', () => {
      When(
        waitForAsync(() => {
          createDirectiveWithConfig(showWhen);
          spectator.typeInElement('5', 'input');
        })
      );

      ExpectErrorVisibilityForStates({
        expectedVisibility: true,
        forStates: ['dirty'],
      });

      ExpectErrorVisibilityForStates({
        expectedVisibility: false,
        forStates: ['touched', 'touchedAndDirty', 'formIsSubmitted'],
      });
    });

    describe('WHEN: type in the input and focus out (touch)', () => {
      When(
        waitForAsync(() => {
          createDirectiveWithConfig(showWhen);
          spectator.typeInElement('5', 'input');
          spectator.blur('input');
        })
      );

      ExpectErrorVisibilityForStates({
        expectedVisibility: true,
        forStates: ['dirty', 'touched', 'touchedAndDirty'],
      });

      ExpectErrorVisibilityForStates({
        expectedVisibility: false,
        forStates: ['formIsSubmitted'],
      });
    });
  });

  describe('TEST: getting error details', () => {
    // Number should be greater than {{minError.ctx.min}}. You've typed {{minError.ctx}}.
    Given(() => {
      template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div ngxError="min" #min="ngxError">
            Number should be greater than {{min.err.min}}. You've typed {{min.err.actual}}.
          </div>
        </div>

        <div id="error-outside" *ngIf="min.err.min">min: {{min.err.min}}</div>

        <button type="submit"></button>
      </form>`;
    });

    When(
      waitForAsync(() => {
        createDirectiveWithConfig(showWhen);
        spectator.click('button');
      })
    );

    Then(
      'You can access error details and can use them outside of ngxErrors',
      () => {
        expect(spectator.element).toContainText(
          "Number should be greater than 10. You've typed 3."
        );

        expect(spectator.query('#error-outside')).toContainText('min: 10');
      }
    );
  });

  describe('TEST: directive is inside of child OnPush component', () => {
    Given(() => {
      template = `
      <form>
        <app-test-child-address [address]="addressModel"></app-test-child-address>

        <button type="submit">Submit</button>
      </form>`;
    });

    When(
      waitForAsync(async () => {
        createDirectiveWithConfig(showWhen);
        await spectator.fixture.whenRenderingDone();
        spectator.hostComponent.ngForm.form.markAllAsTouched();
      })
    );

    ExpectErrorVisibilityForStates({
      expectedVisibility: true,
      forStates: ['touched', 'formIsSubmitted'],
    });

    ExpectErrorVisibilityForStates({
      expectedVisibility: false,
      forStates: ['dirty', 'touchedAndDirty'],
    });
  });
});

function wait(t: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}
