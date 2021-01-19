import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dependentValidator } from '@ngspot/ngx-errors';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyComponent implements OnInit {
  form: FormGroup;
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      address: fb.group({
        street: [
          '',
          dependentValidator<string>({
            watchControl: (f) => f!.get('firstName')!,
            condition: (val) => !!val,
            validator: () => Validators.required,
          }),
        ],
      }),
    });
  }

  ngOnInit() {}

  submit() {
    console.log('submit');
  }
}
