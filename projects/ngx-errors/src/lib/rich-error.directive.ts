import {
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Input,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ErrorBase } from './error.base';
import { ErrorsDirective } from './errors.directive';
import { ErrorsConfiguration } from './errors-configuration';

export class ObservablesContext {
  [key: string]: any;
}

/**
 * Structural directive to provide a rich validation error message for a specific error name.
 * Used as a child of ngxErrors directive.
 *
 * Example:
 * ```html
 * <div *ngxRichError="'minlength'; let actualLength=actualLength; let requiredLength=requiredLength">
 *   Value should be at least {{requiredLength}} long; Right now it's {{actualLength}}
 * </div>
 * ```
 */
@Directive({
  selector: '[ngxRichError]',
})
export class RichErrorDirective extends ErrorBase {
  private ref: EmbeddedViewRef<ObservablesContext> | undefined;
  private _context = new ObservablesContext();

  @Input() set ngxRichError(errorName: string) {
    this.errorName = errorName;
  }

  constructor(
    private template: TemplateRef<ObservablesContext>,
    private viewContainer: ViewContainerRef,
    cdr: ChangeDetectorRef,
    // ErrorsDirective is actually required.
    // use @Optional so that we can throw a custom error
    @Optional() errorsDirective: ErrorsDirective,
    @Optional() config: ErrorsConfiguration
  ) {
    super(cdr, errorsDirective, config);
  }

  changeErrorVisibility(error: any): void {
    if (error) {
      Object.assign(this._context, error);
      if (!this.ref) {
        this.ref = this.viewContainer.createEmbeddedView(
          this.template,
          this._context
        );
      }
    } else {
      this.viewContainer.clear();
      this.ref = undefined;
    }
  }
}
