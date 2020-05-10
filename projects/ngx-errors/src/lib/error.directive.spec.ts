import { Component } from '@angular/core';
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
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

@Component({})
class TestHostComponent {
  validInitialVal = new FormControl('val', Validators.required);
  invalidInitialVal = new FormControl('', Validators.required);
  form = new FormGroup({
    address: new FormGroup({
      street: new FormControl('', Validators.required),
    }),
  });

  submit() {}
}

describe('ErrorDirective without config', () => {
  let spectator: SpectatorDirective<ErrorDirective>;
  const createDirective = createDirectiveFactory({
    directive: ErrorDirective,
    declarations: [ErrorsDirective],
    host: TestHostComponent,
  });

  function createDirectiveWithConfig(config: IErrorsConfiguration) {
    spectator = createDirective(template, {
      providers: [
        {
          provide: ErrorsConfiguration,
          useValue: config,
        },
      ],
    });
  }

  const defaultConfig = new ErrorsConfiguration();

  const template = `
    <div [ngxErrors]="validInitialVal">
      <div ngxError="req"></div>
    </div>`;

  it('should use config defaults if no config is provided', () => {
    spectator = createDirective(template);
    expect(spectator.directive['config']).toEqual(defaultConfig);
  });

  it('should correctly set default for showErrorsWhenFormSubmitted', () => {
    createDirectiveWithConfig({ showErrorsOnlyIfInputDirty: false });

    const actual = spectator.directive['config'];
    expect(actual.showErrorsOnlyIfInputDirty).toBe(false);
    expect(actual.showErrorsWhenFormSubmitted).toBe(false);
  });

  it('should correctly set default for showErrorsOnlyIfInputDirty', () => {
    createDirectiveWithConfig({ showErrorsWhenFormSubmitted: true });

    const actual = spectator.directive['config'];
    expect(actual.showErrorsOnlyIfInputDirty).toBe(true);
    expect(actual.showErrorsWhenFormSubmitted).toBe(true);
  });
});

describe('ErrorDirective ', () => {
  let spectator: SpectatorDirective<ErrorDirective, TestHostComponent>;
  const initialConfig: IErrorsConfiguration = {
    showErrorsOnlyIfInputDirty: false,
    showErrorsWhenFormSubmitted: false,
  };
  const createDirective = createDirectiveFactory({
    directive: ErrorDirective,
    declarations: [ErrorsDirective],
    imports: [ReactiveFormsModule],
    providers: [{ provide: ErrorsConfiguration, useValue: initialConfig }],
    host: TestHostComponent,
  });

  it('should throw if no parent ngxErrors is found', () => {
    expect(() => {
      createDirective(`<div ngxError="required">Required</div>`);
    }).toThrow(new NoParentNgxErrorsError());
  });

  describe('GIVEN: with parent ngxErrors', () => {
    Then('should throw if errorName is not provided', () => {
      expect(() => {
        createDirective(`
        <div [ngxErrors]="invalidInitialVal">
          <div ngxError>Required</div>
        </div>`);
      }).toThrow(new ValueMustBeStringError());
    });

    describe('GIVEN: valid initial value', () => {
      Given(() => {
        const template = `
          <div [ngxErrors]="validInitialVal">
            <div ngxError="required">Required</div>
          </div>
        `;
        spectator = createDirective(template);
      });

      Then('should initially be hidden', () => {
        expect(spectator.element).toBeHidden();
      });

      describe('GIVEN: validity change', () => {
        When(() => {
          spectator.hostComponent.validInitialVal.setValue('');
        });

        Then('should be visible', () => {
          expect(spectator.element).toBeVisible();
        });
      });
    });

    describe('GIVEN: invalid initial value', () => {
      Given(() => {
        const template = `
          <div [ngxErrors]="invalidInitialVal">
            <div ngxError="required">Required</div>
          </div>
        `;
        spectator = createDirective(template);
      });

      Then('should initially be visible', () => {
        expect(spectator.element).toBeVisible();
      });

      describe('GIVEN: validity change', () => {
        When(() => {
          spectator.hostComponent.invalidInitialVal.setValue('val');
        });

        Then('should be hidden', () => {
          expect(spectator.element).toBeHidden();
        });
      });
    });
  });

  describe('GIVEN: complex example', () => {
    function createDirectiveWithConfig(config: IErrorsConfiguration) {
      const template = `
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div formGroupName="address">
            <input formControlName="street" type="text" />
            <div ngxErrors="street">
              <div ngxError="required">Required</div>
            </div>
            <button type="submit">Submit</button>
          </div>
        </form>
      `;
      spectator = createDirective(template, {
        providers: [{ provide: ErrorsConfiguration, useValue: config }],
      });
    }

    describe('GIVEN: config.showErrorsOnlyIfInputDirty = true', () => {
      Given(() => {
        createDirectiveWithConfig({
          showErrorsOnlyIfInputDirty: true,
          showErrorsWhenFormSubmitted: false,
        });
      });

      Then(() => {
        expect(spectator.element).toBeHidden();

        spectator.typeInElement('', 'input');

        expect(spectator.element).toBeVisible();
      });
    });

    describe('GIVEN: config.showErrorsWhenFormSubmitted = true', () => {
      Given(() => {
        createDirectiveWithConfig({
          showErrorsOnlyIfInputDirty: false,
          showErrorsWhenFormSubmitted: true,
        });
      });

      Then(() => {
        expect(spectator.element).toBeVisible();

        spectator.click('button');

        expect(spectator.element).toBeVisible();
      });
    });

    describe('GIVEN: config.props are true', () => {
      Given(() => {
        createDirectiveWithConfig({
          showErrorsOnlyIfInputDirty: true,
          showErrorsWhenFormSubmitted: true,
        });
      });

      When(() => {
        spectator.click('button');
      });

      describe('GIVEN: controls stays clean before form is submitted', () => {
        Given(() => {
          expect(spectator.element).toBeHidden();
        });

        Then(() => {
          expect(spectator.element).toBeVisible();
        });
      });

      describe('GIVEN: control gets dirty before form is submitted', () => {
        Given(() => {
          expect(spectator.element).toBeHidden();
          spectator.typeInElement('', 'input');
          expect(spectator.element).toBeVisible();
        });

        Then(() => {
          expect(spectator.element).toBeVisible();
        });
      });
    });
  });
});
