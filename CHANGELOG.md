# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.1](https://github.com/ngspot/ngx-errors/compare/v3.2.0...v3.2.1) (2022-11-25)

### Bug Fixes

- 🐛 fix compatibility with template-driven forms

## [3.2.0](https://github.com/ngspot/ngx-errors/compare/v3.1.5...v3.2.0) (2022-02-04)

### Features

- 🎸 move material deps into @ngspot/ngx-errors-material ([ad49c7c](https://github.com/ngspot/ngx-errors/commit/ad49c7cca52a24be83e80fb3738ebcd450a3f5ab)), closes [#9](https://github.com/ngspot/ngx-errors/issues/9)

### [3.1.5](https://github.com/ngspot/ngx-errors/compare/v3.1.4...v3.1.5) (2022-01-21)

### Bug Fixes

- 🐛 broken matInput without ngModel ([e8d6f47](https://github.com/ngspot/ngx-errors/commit/e8d6f47ee38fa3effeb59ec59787261291f4d07c))

### [3.1.4](https://github.com/ngspot/ngx-errors/compare/v3.1.3...v3.1.4) (2022-01-16)

### Bug Fixes

- 🐛 providing errorsModule in the lazy app module ([b2f1488](https://github.com/ngspot/ngx-errors/commit/b2f1488a2d3ea004ca6fa0d25b90c240e60e38c6))

### [3.1.3](https://github.com/ngspot/ngx-errors/compare/v3.1.2...v3.1.3) (2022-01-11)

### Bug Fixes

- 🐛 provide config defaults ([5242c70](https://github.com/ngspot/ngx-errors/commit/5242c70a30968af5ea8e9c77b6d755b4886734f8))

## 3.1.2 (2022-01-11)

### Bug Fixes

- 🐛 missed null check for showMaxErrors ([66f2f4c](https://github.com/ngspot/ngx-errors/commit/66f2f4cef75381de843ed4f72189c5df5faad650))

## 3.1.1 (2022-01-11)

### Bug Fixes

- 🐛 class used before it was declared ([66d27a6](https://github.com/ngspot/ngx-errors/commit/66d27a65930d208e63ddfae87a683abfa0912423))

## 3.1.0 (2022-01-11)

### Features

- 🎸 integrate with MatInput; support arbitrary showWhen ([55fd44a](https://github.com/ngspot/ngx-errors/commit/55fd44a1e946ccee34d9cf979925f5bc4e5a6dfa))
- 🎸 new config option - showMaxErrors ([d46ba1b](https://github.com/ngspot/ngx-errors/commit/d46ba1be40a4e49be1d0f2e00c88475806c540ea))

## 3.0.0 (2021-12-09)

### ⚠ BREAKING CHANGES

- 🧨 Require Angular v13

### Features

- 🎸 bump Angular to v13 ([a9b18aa](https://github.com/ngspot/ngx-errors/commit/a9b18aac8f78cca778d43f4c897b50f357df742d))

## 2.0.2 (2021-12-09)

### Bug Fixes

- 🐛 not displaying error when async validator present ([684dcf5](https://github.com/ngspot/ngx-errors/commit/684dcf5114a1e2ac9c6c4e64925d6ebf262cc6ba))

## 2.0.1 (2021-01-19)

### Features

- 🎸 dependentValidator ([b49b82f](https://github.com/ngspot/ngx-errors/commit/b49b82f9cf75b718288c72f190fa2a09ca1469dc))

## 2.0.0 (2020-12-06)

### Features

- You can specify to show errors when input is dirty, touched, dirty and touched or when form is submitted.
- You can now access error details in the template

### Breaking Changes

- 🎸 new config options. The config file now has different signature.

  ```ts
  export interface IErrorsConfiguration {
    showErrorsWhenInput: ShowErrorWhen;
  }

  export type ShowErrorWhen =
    | 'touched'
    | 'dirty'
    | 'touchedAndDirty'
    | 'formIsSubmitted';
  ```

### Bug Fixes

- 🐛 headless test not working ([d73f689](https://github.com/ngspot/ngx-errors/commit/d73f689d6010b3c728167d24a815b1ea7fe7255c))

## 1.0.1 (2020-04-13)

### Bug Fixes

- 🐛 headless test not working ([d73f689](https://github.com/ngspot/ngx-errors/commit/d73f689d6010b3c728167d24a815b1ea7fe7255c))

## 1.0.0 (2020-04-13)

### Features

- create project ([fa7b22d](https://github.com/ngspot/ngx-errors/commit/fa7b22dab9f8cb43e2d0760c6aa30655987df95a))
