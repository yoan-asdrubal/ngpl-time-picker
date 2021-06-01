import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgplTimePickerComponent } from './ngpl-time-picker.component';

describe('WidgetTimePickerComponent', () => {
  let component: NgplTimePickerComponent;
  let fixture: ComponentFixture<NgplTimePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgplTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgplTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
