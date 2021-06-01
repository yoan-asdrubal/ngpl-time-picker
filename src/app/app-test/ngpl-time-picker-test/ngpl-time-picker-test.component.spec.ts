import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgplTimePickerTestComponent } from './ngpl-time-picker-test.component';

describe('NgplSelectTestComponent', () => {
  let component: NgplTimePickerTestComponent;
  let fixture: ComponentFixture<NgplTimePickerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgplTimePickerTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgplTimePickerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
