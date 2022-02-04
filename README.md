<p align="center">
 <img width="20%" height="20%" src="./logo.png">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)](https://github.com/ngneat/spectator)

> Reactive forms validation for pros

I very much missed the `ng-messages` directive from AngularJS, so I created a similar set of directives to use in Angular 2+.
In contrast to the directives from AngularJS, the directives in this library require passing the control name to the directive, instead of the control's errors.
This allowed me to hook into the status of control, such as its `dirty` state, and display validation messages according to that status.
The design of this library promotes less boilerplate code, which keeps your templates clean.

## Features

- ✅ Simple syntax that reduces boilerplate
- ✅ Configure when to display error messages for an app further reducing boilerplate
- ✅ Seamless integration with Reactive Forms
- ✅ Works with nested forms

## Table of Contents

- [How it works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Handling form submission](#handling-form-submission)
- [Getting error details](#getting-error-details)
- [Styling](#styling)
- [Miscellaneous](#miscellaneous)
- [Development](#development)

## How it works

There are a few rules that the library follows to determine when to display errors:

- Errors will be shown no matter what configuration you're using after form is submitted.
- If no configuration is provided, the errors will be shown when control is `touched`.
  - This is chosen due to the UX guidelines. Read (1) [How to Report Errors in Forms](https://www.nngroup.com/articles/errors-forms-design-guidelines/) and (2) [Designing More Efficient Forms](https://uxplanet.org/designing-more-efficient-forms-assistance-and-validation-f26a5241199d) for more info.
- If you configured errors to be shown when `formIsSubmitted`, but dealing with a control that does not have a parent _form_, the config for this control will fall back to `touched`.

For more info about this see [Advanced configuration](#configuration).

## Installation

- For Angular >= v13 use @ngspot/ngx-errors@3.x
- For Angular < v13 use @ngspot/ngx-errors@2.x

### NPM

`npm install @ngspot/ngx-errors`

### Yarn

`yarn add @ngspot/ngx-errors`

## Usage

Import library into application module:

```ts
import { NgxErrorsModule } from '@ngspot/ngx-errors'; // <-- import the module

@NgModule({
  imports: [
    NgxErrorsModule, // <-- include imported module in app module
  ],
})
export class MyAppModule {}
```

### Use case with a form:

```ts
@Component({
  selector: 'my-component',
  template: `
    <form [formGroup]="myForm">
      <input formControlName="email" type="email" />

      <div ngxErrors="email">
        <div ngxError="required">Email is required</div>
      </div>
    </form>
  `,
})
export class MyComponent implements OnInit {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
    });
  }
}
```

### Use case with a simple FormControl:

```ts
@Component({
  selector: 'my-component',
  template: `
    <input [formControl]="email" placeholder="Email" type="email" />

    <div [ngxErrors]="email">
      <div ngxError="required">Email is required</div>
    </div>
  `,
})
export class MyComponent implements OnInit {
  email = new FormControl('', Validators.required);
}
```

### Use case with a template driven form control:

```ts
@Component({
  selector: 'my-component',
  template: `
    <input [(ngModel)]="email" #emailModel="ngModel" required type="email" />

    <div [ngxErrors]="emailModel.control">
      <div ngxError="required">Email is required</div>
    </div>
  `,
})
export class MyComponent implements OnInit {
  email: string;
}
```

## Configuration

Configure when to show messages for whole module by using `.configure()` method:

```ts
@NgModule({
  imports: [
    NgxErrorsModule.configure({ ... }) // <- provide configuration here
  ],
})
export class MyAppModule {}
```

Alternatively, use dependency injection to provide configuration at a component level:

```ts
import { ErrorsConfiguration, IErrorsConfiguration } from '@ngspot/ngx-errors';

const myConfig: IErrorsConfiguration = { ... }; // <- specify config

@Component({
  ...
  providers: [
    { provide: ErrorsConfiguration, useValue: myConfig }
  ]
})
export class MyComponent { }
```

Here's the configuration object interface:

```ts
export interface IErrorsConfiguration {
  /**
   * Configures when to display an error for an invalid control. Options that
   * are available by default are listed below. Note, custom options can be
   * provided using CUSTOM_ERROR_STATE_MATCHERS injection token.
   *
   * `'touched'` - *[default]* shows an error when control is marked as touched. For example, user focused on the input and clicked away or tabbed through the input.
   *
   * `'dirty'` - shows an error when control is marked as dirty. For example, when user has typed something in.
   *
   * `'touchedAndDirty'` - shows an error when control is marked as both - touched and dirty.
   *
   * `'formIsSubmitted'` - shows an error when parent form was submitted.
   */
  showErrorsWhenInput: string;

  /**
   * The maximum amount of errors to display per ngxErrors block.
   */
  showMaxErrors?: number;
}
```

### Providing custom logic for displaying errors

By default, the following error state matchers for displaying errors can be used: `'touched'`, `'dirty'`, `'touchedAndDirty'`, `'formIsSubmitted'`.

Custom error state matchers can be added using the `CUSTOM_ERROR_STATE_MATCHERS` injection token.

First, define the new error state matcher:

```ts
@Injectable({ providedIn: 'root' })
export class MyAwesomeErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.value && /* my awesome logic is here */);
  }
}
```

Second, use the new error state matcher when providing `CUSTOM_ERROR_STATE_MATCHERS` in the AppModule:

```ts
providers: [
  {
    provide: CUSTOM_ERROR_STATE_MATCHERS,
    deps: [MyAwesomeErrorStateMatcher],
    useFactory: (myAwesomeErrorStateMatcher: MyAwesomeErrorStateMatcher) => {
      return {
        myAwesome: myAwesomeErrorStateMatcher,
      };
    },
  },
];
```

Now the string `'myAwesome'` can be used either in the `showErrorsWhenInput` property of the configuration object or in the `[showWhen]` inputs.

### Overriding global config

You can override the configuration specified at the module level by using `[showWhen]` input on `[ngxErrors]` and on `[ngxError]` directives:

```html
<div ngxErrors="control" showWhen="touchedAndDirty">
  <div ngxError="required" showWhen="dirty">
    This will be shown when control is dirty
  </div>

  <div ngxError="min">This will be shown when control is touched and dirty</div>
</div>
```

## Handling form submission

Often there's a requirement to submit a form when user presses _Enter_. Under the hood ngxError relies on form submit event to display errors. That is why it's important to trigger form submission properly rather than binding `(keyup.enter)` event to the method in your component class directly. Here's how to do that:

```html
<form
  [formGroup]="form"
  (ngSubmit)="yourMethod()"
  (keyup.enter)="submitBtn.click()"
>
  ...

  <button #submitBtn>Submit</button>
</form>
```

## Getting error details

Each control error in Angular may contain additional details. For example, here's what `min` error looks like:

```ts
const control = new FormControl(3, Validators.min(10));
const error = control.getError('min');
console.log(error); // prints: { min: 10, actual: 3 }
```

You can easily get access to these details in the template:

```html
<div ngxErrors="control">
  <div ngxError="min" #myMin="ngxError">
    Number should be greater than {{myMin.err.min}}. You've typed
    {{myMin.err.actual}}.
  </div>
</div>
```

In the example above we're assigning a variable `myMin` (can be anything you want) to the directive `ngxError`. Using this variable we can access the context of the directive. The directive has property `err` that contains all the error details.

## Styling

Include something similar to the following in global CSS file:

```css
[ngxerrors] {
  color: red;
}
```

## Integration with @angular/material

Angular Material inputs have [their own way](https://material.angular.io/components/input/overview#changing-when-error-messages-are-shown) of setting logic for determining if the input needs to be highlighted red or not. If custom behavior is needed, a developer needs to provide appropriate configuration. @ngspot/ngx-errors configures this functionality for the developer under the hood. In order for this configuration to integrate with @angular/material inputs smoothly, use package `@ngspot/ngx-errors-material`:

Install:

```
npm install @ngspot/ngx-errors-material
```

Use:

```ts
import { NgxErrorsMaterialModule } from '@ngspot/ngx-errors-material';

@NgModule({
  imports: [
    // ...
    NgxErrorsMaterialModule
  ]
})
```

## Miscellaneous

ngx-errors library provides a couple of misc function that ease your work with forms.

### **dependentValidator**

Makes it easy to trigger validation on the control, that depends on a value of a different control

Example with using `FormBuilder`:

```ts
import { dependentValidator } from '@ngspot/ngx-errors';

export class LazyComponent {
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      password: ['', Validators.required],
      confirmPassword: [
        '',
        dependentValidator<string>({
          watchControl: (f) => f!.get('password')!,
          validator: (passwordValue) => isEqualToValidator(passwordValue),
        }),
      ],
    });
  }
}

function isEqualToValidator<T>(compareVal: T): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors | null {
    return control.value === compareVal
      ? null
      : { match: { expected: compareVal, actual: control.value } };
  };
}
```

The `dependentValidator` may also take `condition`. If provided, it needs to return true for the validator to be used.

```ts
const controlA = new FormControl('');
const controlB = new FormControl(
  '',
  dependentValidator<string>({
    watchControl: () => controlA,
    validator: () => Validators.required,
    condition: (val) => val === 'fire',
  })
);
```

In the example above, the `controlB` will only be required when `controlA` value is `'fire'`

### **extractTouchedChanges**

As of today, the FormControl does not provide a way to subscribe to the changes of `touched` status. This function lets you do just that:

```ts
* const touchedChanged$ = extractTouchedChanges(formControl);
```

### **markDescendantsAsDirty**

As of today, the FormControl does not provide a way to mark the control and all its children as `dirty`. This function lets you do just that:

```ts
markDescendantsAsDirty(formControl);
```

## Development

### Basic Workflow

One time config: `git config --global push.followTags true`

1. Develop
1. Write specs
1. Run `npm run test:lib`
1. Run `npm run commit` and choose fix or feature
1. Run `npm run release`
1. Run `npm run build:lib`
1. Go to the dist directory and run `npm publish`
1. Push changes `git push`

### Scripts

- `build:lib` - Builds the library
- `test:lib` - Runs tests
- `test:lib:headless` - Runs tests in headless mode with Chrome
- `release` - Releases a new version; this will bump the library's version and update the `CHANGE_LOG` file based on the commit message
- `release:first` - Creates the first release
- `commit` - Creates a new commit message based on Angular commit message convention
- `contributors:add` - Adds a new contributor to the `README` file

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/DmitryEfimenko/"><img src="https://avatars0.githubusercontent.com/u/2098175?v=4" width="100px;" alt=""/><br /><sub><b>Dmitry A. Efimenko</b></sub></a><br /><a href="https://github.com/ngspot/ngs-errors/commits?author=DmitryEfimenko" title="Code">💻</a> <a href="#design-DmitryEfimenko" title="Design">🎨</a> <a href="https://github.com/ngspot/ngs-errors/commits?author=DmitryEfimenko" title="Documentation">📖</a> <a href="#ideas-DmitryEfimenko" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/AnaBoca"><img src="https://avatars0.githubusercontent.com/u/17017510?v=4" width="100px;" alt=""/><br /><sub><b>Ana Boca</b></sub></a><br /><a href="https://github.com/ngspot/ngs-errors/commits?author=AnaBoca" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
