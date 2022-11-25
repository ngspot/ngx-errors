export class NgxError extends Error {
  constructor(message: string) {
    super(`NgxError: ${message}`);
  }
}

export class NoParentNgxErrorsError extends NgxError {
  constructor() {
    super('Directive ngxError requires a parent directive ngxErrors');
  }
}

export class ValueMustBeStringError extends NgxError {
  constructor() {
    super('Directive ngxError requires a string value');
  }
}

export class NoControlError extends NgxError {
  constructor() {
    super(
      'Directive ngxErrors requires either control name or control instance'
    );
  }
}

export class ControlInstanceError extends NgxError {
  constructor() {
    super('Control must be either a FormGroup, FormControl or FormArray');
  }
}

export class ControlNotFoundError extends NgxError {
  constructor(name: string) {
    super(`Control "${name}" could not be found`);
  }
}

export class ParentFormGroupNotFoundError extends NgxError {
  constructor(name: string) {
    super(
      `Can't search for control "${name}" because parent FormGroup is not found`
    );
  }
}

export class InvalidShowWhenError extends NgxError {
  constructor(showWhen: string, keys: string[]) {
    super(
      `Invalid showWhen value: ${showWhen}. Valid values are: ${keys.join(
        ', '
      )}`
    );
  }
}
