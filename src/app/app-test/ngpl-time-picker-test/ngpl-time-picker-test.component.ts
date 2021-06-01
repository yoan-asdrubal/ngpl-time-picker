import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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
      timepicker: [],
      timepicker1: [],
      timepicker2: [],
      timepicker3: [],
      timepicker4: [],
      timepicker5: []

    });


  }


}
