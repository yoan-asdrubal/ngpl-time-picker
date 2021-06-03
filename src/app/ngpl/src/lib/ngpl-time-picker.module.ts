import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {OverlayModule} from '@angular/cdk/overlay';
import {NgplCommonDirectivesModule, NgplCommonModule} from 'ngpl-common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgplTimePickerComponent} from './ngpl-time-picker/ngpl-time-picker.component';
import {MatTooltipModule} from '@angular/material/tooltip';

const components = [
  NgplTimePickerComponent
];

@NgModule({
  declarations: [components],
  exports: [components],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatTooltipModule,
    OverlayModule,
    NgplCommonModule,
    NgplCommonDirectivesModule
  ]
})
export class NgplTimePickerModule {
}
