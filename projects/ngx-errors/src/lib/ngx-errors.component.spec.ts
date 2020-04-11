import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxErrorsComponent } from './ngx-errors.component';

describe('NgxErrorsComponent', () => {
  let component: NgxErrorsComponent;
  let fixture: ComponentFixture<NgxErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
