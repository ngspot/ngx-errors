import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { first } from 'rxjs/operators';
import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import {
  ControlNotFoundError,
  NoControlError,
  ParentFormGroupNotFoundError,
} from './ngx-errors';

@Component({})
class TestHostComponent {
  street = new FormControl();
  control = new FormControl();
  form = new FormGroup({
    firstName: new FormControl(),
    address: new FormGroup({
      street: this.street,
    }),
  });
}

describe(ErrorsDirective.name, () => {
  let spectator: SpectatorDirective<ErrorsDirective, TestHostComponent>;
  const createDirective = createDirectiveFactory({
    directive: ErrorsDirective,
    host: TestHostComponent,
    imports: [ReactiveFormsModule],
    providers: [ErrorsConfiguration],
  });

  it('should throw if no control is provided', () => {
    expect(() => {
      createDirective(`<div ngxErrors></div>`);
    }).toThrow(new NoControlError());
  });

  describe('GIVEN: with control', () => {
    describe('GIVEN: control is an instance of FormControl', () => {
      Given(() => {
        spectator = createDirective(`<div [ngxErrors]="control"></div>`);
      });

      Then('should not throw', () => {
        expect(spectator.directive.control$).toBeDefined();
      });
    });

    describe('GIVEN: control is NOT an instance of FormControl', () => {
      Then('should throw', () => {
        expect(() => {
          createDirective(`<div ngxErrors="something"></div>`);
        }).toThrow(new ParentFormGroupNotFoundError('something'));
      });
    });
  });

  describe('GIVEN: with parent formGroup', () => {
    function expectControl(expectedControl: AbstractControl) {
      let actualControl: AbstractControl | undefined;

      spectator.directive.control$.pipe(first()).subscribe((control) => {
        actualControl = control;
      });

      expect(actualControl).toBe(expectedControl);
    }

    describe('GIVEN: control specified as string; control exists', () => {
      Then('should not throw', () => {
        expect(() => {
          spectator = createDirective(`
          <div [formGroup]="form">
            <div ngxErrors="firstName"></div>
          </div>
          `);
        }).not.toThrow();

        const fName = spectator.hostComponent.form.get(
          'firstName'
        ) as FormControl;

        expectControl(fName);
      });
    });

    describe('GIVEN: control specified as string; control DOES NOT exist', () => {
      Then('should throw', () => {
        expect(() => {
          createDirective(`
          <form [formGroup]="form">
            <div ngxErrors="mistake"></div>
          </form>
          `);
        }).toThrow(new ControlNotFoundError('mistake'));
      });
    });

    describe('GIVEN: formGroup with nested formGroupName', () => {
      Given(() => {
        expect(() => {
          spectator = createDirective(`
          <form [formGroup]="form">
            <div formGroupName="address">
              <div ngxErrors="street"></div>
            </div>
          </form>
          `);
        }).not.toThrow();
      });

      Then('control should be the "street"', () => {
        expectControl(spectator.hostComponent.street);
      });
    });

    describe('GIVEN: formGroup with nested formGroup', () => {
      Given(() => {
        expect(() => {
          spectator = createDirective(`
          <form [formGroup]="form">
            <div [formGroup]="form.get('address')">
              <div ngxErrors="street"></div>
            </div>
          </form>
          `);
        }).not.toThrow();
      });

      Then('control should be the "street"', () => {
        expectControl(spectator.hostComponent.street);
      });
    });
  });
});
