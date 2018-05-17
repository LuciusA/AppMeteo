import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DownloadPage } from '../pages/download/download';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { GraphPage } from "../pages/graph/graph";
import { FileProvider } from '../providers/file/file';
import { MyApp } from './app.component';
import { ToastController } from 'ionic-angular';
@NgModule({
  declarations: [MyApp, DownloadPage, HomePage, TabsPage, GraphPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, DownloadPage, HomePage, TabsPage, GraphPage],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FileProvider
  ]
})
export class AppModule {}
