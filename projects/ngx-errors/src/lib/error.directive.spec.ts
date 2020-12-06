import { Component } from '@angular/core';
import { async } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  IErrorsConfiguration,
  ShowErrorWhen,
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

@Component({})
class TestHostComponent {
  validInitialVal = new FormControl('val', Validators.required);
  invalidInitialVal = new FormControl('', Validators.required);

  form = new FormGroup({
    validInitialVal: new FormControl('val', Validators.required),
    invalidInitialVal: new FormControl(3, Validators.min(10)),
  });

  submit() {}
}

describe('ErrorDirective', () => {
  const initialConfig: IErrorsConfiguration = {
    showErrorsWhenInput: 'touched',
  };

  const createDirective = createDirectiveFactory({
    directive: ErrorDirective,
    declarations: [ErrorsDirective],
    imports: [ReactiveFormsModule],
    providers: [{ provide: ErrorsConfiguration, useValue: initialConfig }],
    host: TestHostComponent,
  });

  let template: string;
  let spectator: SpectatorDirective<ErrorDirective, TestHostComponent>;
  let showWhen: ShowErrorWhen;

  Given(() => (showWhen = undefined as any));

  function createDirectiveWithConfig(showErrorsWhenInput: ShowErrorWhen) {
    const config: IErrorsConfiguration = { showErrorsWhenInput };
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
    forStates: ShowErrorWhen[];
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
    let actual: ShowErrorWhen;

    When(() => {
      createDirectiveWithConfig(showWhen);
      actual = spectator.directive.showWhen;
    });

    describe('GIVEN: There is a parent form', () => {
      describe('GIVEN: there is no override at the directive level', () => {
        Given(() => {
          template = `
            <form [formGroup]="form">
              <div [ngxErrors]="'invalidInitialVal'">
                <div ngxError="req"></div>
              </div>
            </form>`;
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

    describe('GIVEN: There is no parent form', () => {
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
    let testControl: 'validInitialVal' | 'invalidInitialVal';

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
      async(() => {
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
        async(() => {
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
        async(() => {
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
        async(() => {
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
      async(() => {
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
});
