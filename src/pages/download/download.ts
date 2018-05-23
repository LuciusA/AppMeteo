import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { GraphPage } from "../graph/graph";

@Component({
  selector: 'page-download',
  templateUrl: 'download.html'
})
export class DownloadPage {
  files: string = 'downloads';
  downloads;
  downloadeds;

  constructor(
    public navCtrl: NavController,
    public fileNavigator: File,
    public plt: Platform,
    public toastCtrl: ToastController
  ) {
    plt.ready().then(() => {
      this.listDir();
    });
  }

  async listDir() {
    try {
      this.downloads = await this.fileNavigator.listDir(
        this.fileNavigator.applicationDirectory,
        'www/assets/files/'
      );
      this.downloadeds = await this.fileNavigator.listDir(
        this.fileNavigator.applicationDirectory,
        'www/assets/downloaded/'
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  handleError(error) {
    console.log('error reading,', error);
  }

  async readFile(fileName) {
    const fileOpened = await this.fileNavigator.readAsText(
      this.fileNavigator.applicationDirectory + '/www/assets/files/',
      fileName
    );

    let lines = fileOpened.split('\n');
    let dateHour = lines[2].split('\t');
    let dateName = dateHour[0].split(' ');

    try {
      const newFile = await this.fileNavigator.copyFile(
        this.fileNavigator.applicationDirectory + '/www/assets/files/',
        fileName,
        this.fileNavigator.applicationDirectory + '/www/assets/downloaded/',
        dateName[0]
      );
      this.downloadeds.push(newFile);
      this.showToast('Your file was successfully downloaded');
    } catch (e) {
      let str = JSON.stringify(e);
      console.log(str);
      this.showToast('File already downloaded');
    }
  }

  async deleteFile(fileName, page) {
    try {
      if (page == 'left') {
        await this.fileNavigator.removeFile(
          this.fileNavigator.applicationDirectory + '/www/assets/files/',
          fileName
        );
        this.listDir();
        this.showToast('Your file was successfully deleted');
      } else {
        await this.fileNavigator.removeFile(
          this.fileNavigator.applicationDirectory + '/www/assets/downloaded/',
          fileName
        );
        this.listDir();
        this.showToast('Your file was successfully deleted');
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  openData(fileName) {
    this.navCtrl.push(GraphPage, {fileName: fileName});
    return fileName;
  }

  showToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() {
    console.info('Toast onDidDismiss()');
  }
}
