# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
