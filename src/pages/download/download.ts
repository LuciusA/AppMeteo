import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, Platform } from 'ionic-angular';

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
    public plt: Platform
  ) {
    plt.ready().then(() => {
      this.listDir(
        this.fileNavigator.applicationDirectory,
        'www/assets/files/'
      );
    });
  }

  listDir(path, dirName) {
    console.log('couocui');
    this.fileNavigator
      .listDir(path, dirName)
      .then(entries => {
        this.downloads = entries;
        var str = JSON.stringify(entries, null, 4);
        console.log(str);
      })
      .catch(this.handleError);
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
    const newFile = await this.fileNavigator
      .copyFile(
        this.fileNavigator.applicationDirectory + '/www/assets/files/',
        fileName,
        this.fileNavigator.applicationDirectory + '/www/assets/files/',
        dateName[0]
      )
      this.downloads.push(newFile);

     }catch(e){
       let str = JSON.stringify(e);
      console.log(str);
    }
  }
}
