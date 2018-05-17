import { Component } from '@angular/core';
import * as HighCharts from 'highcharts';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from "@ionic-native/file";

/**
 * Generated class for the GraphPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {
  myChart;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform,
    public fileNavigator: File
  ) {
    let fileName = navParams.get('fileName');
    this.getDataFile(fileName);
  }

  async getDataFile(fileName) {
    const fileOpened = await this.fileNavigator.readAsBinaryString(
      this.fileNavigator.applicationDirectory + '/www/assets/downloaded/',
      fileName
    );
    console.log(fileOpened);
    return fileOpened
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecondPage');
    this.myChart = HighCharts.chart('container', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Données météorologiques'
      },
      xAxis: {
        categories: ['1', '2', '3', '4', '5']
      },
      yAxis: {
        title: {
          text: 'Euro'
        }
      },
      series: [
        {
          name: 'Jane',
          data: [1, 0, 4]
        },
        {
          name: 'John',
          data: [5, 7, 3]
        }
      ]
    });
  }
}
