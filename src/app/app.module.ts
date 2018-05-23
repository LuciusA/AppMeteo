import { ErrorHandler, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DownloadPage } from '../pages/download/download';
import { GraphPage } from '../pages/graph/graph';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { FileProvider } from '../providers/file/file';
import { MyApp } from './app.component';

declare function require(name:string);
export function highchartsFactory() {
  var hc = require('highcharts');
  return hc;
}

@NgModule({
  declarations: [MyApp, DownloadPage, HomePage, TabsPage, GraphPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), ChartModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, DownloadPage, HomePage, TabsPage, GraphPage],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: HighchartsStatic,
      useFactory: highchartsFactory },
    FileProvider
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
