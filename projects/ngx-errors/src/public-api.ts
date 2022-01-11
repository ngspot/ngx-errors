import { ErrorStateMatcher as MatErrorStateMatcher } from '@angular/material/core';
/*
 * Public API Surface of ngx-errors
 */

export * from './lib/custom-error-state-matchers';
export * from './lib/error.directive';
export * from './lib/errors-configuration';
export * from './lib/errors.directive';
export * from './lib/errors.module';
export * from './lib/misc';
export * from './lib/ngx-errors';
export * from './lib/set-mat-input-error-state-matcher.directive';
export * from './lib/validators';

/**
 * Re-export the Material error state matcher for apps that do not
 * depend on @angular/material.
 */
export type ErrorStateMatcher = MatErrorStateMatcher;
