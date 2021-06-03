import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {currentTimeStringFormatted} from 'ngpl-common';

@Component({
  selector: 'ngpl-time-picker-test',
  templateUrl: './ngpl-time-picker-test.component.html',
  styleUrls: ['./ngpl-time-picker-test.component.scss']
})
export class NgplTimePickerTestComponent implements OnInit {

  formGroup: FormGroup;
  disableControl = new FormControl();
  readOnlyControl = new FormControl();
  loadingControl = new FormControl();


  constructor(private _formB: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this._formB.group({
      timepicker: [null],
      timepicker1: [currentTimeStringFormatted()],
      timepicker2: ['20:40'],
      timepicker3: ['40:40'],
      timepicker4: ['20:80'],
      timepicker5: ['0:0']

    });


  }


}
