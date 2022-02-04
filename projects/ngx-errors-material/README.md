<p align="center">
 <img width="20%" height="20%" src="./logo.png">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

> Reactive forms validation for pros

This package is expected to be installed together with the package `@ngspot/ngx-errors` when use use `@angular/material` inputs.

See full documentation for [@ngspot/ngx-errors here](https://github.com/ngspot/ngx-errors).

## Installation

`npm install @ngspot/ngx-errors-material`

## Usage

Import library into application module:

```ts
import { NgxErrorsModule } from '@ngspot/ngx-errors';
import { NgxErrorsMaterialModule } from '@ngspot/ngx-errors-material'; // <-- import the module

@NgModule({
  imports: [
    NgxErrorsModule,
    NgxErrorsMaterialModule, // <-- include imported module in app module
  ],
})
export class MyAppModule {}
```
