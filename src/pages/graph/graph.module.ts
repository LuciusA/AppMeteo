import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphPage } from './graph';
import { ChartModule } from 'angular2-highcharts';
declare function require(name:string);
@NgModule({
  declarations: [
    GraphPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphPage),
    ChartModule.forRoot(require('highcharts'))
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GraphPageModule {}
