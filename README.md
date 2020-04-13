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

- [Installation](#installation)
- [Usage](#usage)
- [Advanced configuration](#configuration)
- [Styling](#styling)
- [Development](#development)

## Installation

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
import { ErrorsConfiguration } from '@ngspot/ngx-errors';

const myConfig = { ... }; // <- specify config

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
interface IErrorsConfiguration {
  /**
   * Configure errors to show only when the corresponding input is dirty.
   *
   * Default is `true`.
   */
  showErrorsOnlyIfInputDirty?: boolean;

  /**
   * Configure errors to show only when form is submitted.
   * Upon form submission shows errors even if `showErrorsOnlyIfInputDirty = true`
   * and some of the inputs aren't dirty.
   * Takes effect only when ngxErrors directive is a child of a form.
   *
   * Default is `false`.
   */
  showErrorsWhenFormSubmitted?: boolean;
}
```

## Styling

Include something similar to the following in global CSS file:

```css
[ngxerrors] {
  color: red;
}
```

## Development

### Basic Workflow

1. Develop
1. Write specs
1. Run `npm run test:lib`
1. Run `npm run commit` and choose fix or feature
1. Run `npm run release`
1. Run `npm run build:lib`
1. Go to the dist directory and run `npm publish`

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
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
