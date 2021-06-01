import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgplTimePickerTestComponent} from './app-test/ngpl-time-picker-test/ngpl-time-picker-test.component';

const routes: Routes = [
  {
    path: 'ngpl-time-picker',
    component: NgplTimePickerTestComponent
  }, {
    path: '**',
    component: NgplTimePickerTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
