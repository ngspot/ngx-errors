import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        street: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {}

  submit() {
    console.log('submit');
  }
}
