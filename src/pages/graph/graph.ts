import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
//import * as HighCharts from 'highcharts';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {
  chartOptions: any;
  //myChart;
  //private init: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform,
    public fileNavigator: File,
    public loadingCtrl: LoadingController
  ) {
    const fileName = navParams.get('fileName');
    this.addDataToGraph(fileName).then(dataFile => {
      console.log(JSON.stringify(dataFile[7][2]));
      console.log(JSON.stringify(dataFile[7][3]));
      console.log(JSON.stringify(dataFile[7][4]));
      this.chartOptions = {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Données météorologiques'
        },
        xAxis: {
          categories: ['1', '2', '3', '4']
        },
        yAxis: {
          title: {
            text: 'Euro'
          }
        },
        series: [
          {
            name: dataFile['headers'][2],
            data: [parseInt(dataFile[7][2]), parseInt(dataFile[7][3]), parseInt(dataFile[7][4])]
          },
          {
            name: dataFile['headers'][5],
            data: [parseInt(dataFile[9][2]), parseInt(dataFile[9][3]), parseInt(dataFile[9][4])]
          }
        ]
      };
    });
  }

  async addDataToGraph(fileName) {
    const tableData = await this.getDataFile(fileName);
    return tableData;
  }

  getDataFile(fileName) {
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Extrating data ...'
    });
    return new Promise(resolve => {
      loader.present();
      this.fileNavigator
        .readAsText(
          this.fileNavigator.applicationDirectory + '/www/assets/downloaded/',
          fileName
        )
        .then(fileOpened => {
          const lines = fileOpened.split('\n');
          const headers = lines[1].split('\t');
          const tableData = {};
          tableData['headers'] = headers;

          //this.init(lines[2].split('\t'), headers);

          for (let i = 2; i < lines.length - 1; i++) {
            let segment = lines[i].split('\t');
            tableData[i] = segment;
          }
          //console.log(JSON.stringify(tableData));
          console.log('DONE!');
          loader.dismiss();
          resolve(tableData);
        });
    });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SecondPage');
  //   this.myChart = HighCharts.chart('container', {
  //     chart: {
  //       type: 'line'
  //     },
  //     title: {
  //       text: 'Données météorologiques'
  //     },
  //     xAxis: {
  //       categories: ['1', '2', '3', '4', '5']
  //     },
  //     yAxis: {
  //       title: {
  //         text: 'Euro'
  //       }
  //     },
  //     series: [
  //       {
  //         name: 'Jane',
  //         data: [1, 0, 4, 6, 19, 34, 10937]
  //       },
  //       {
  //         name: 'John',
  //         data: [5, 7, 3, 367, 392]
  //       }
  //     ]
  //   });
  // }
}
