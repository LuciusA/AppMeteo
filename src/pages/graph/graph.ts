import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { FileProvider, graphHeaders } from '../../providers/file/file';
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {
  chartOptions: any;
  dataTypes;
  type: any;
  private posColumns: number[] = [];
  graphHeadersKeys: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform,
    public fileNavigator: File,
    public loadingCtrl: LoadingController,
    public fileProvider: FileProvider
  ) {

    const fileName = navParams.get('fileName');
    this.addDataToGraph(fileName).then(dataFile => {
      console.log(JSON.stringify(this.graphHeadersKeys));
      this.graphHeadersKeys;
      /*this.chartOptions = {
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
            data: [
              parseInt(dataFile[7][2]),
              parseInt(dataFile[7][3]),
              parseInt(dataFile[7][4])
            ]
          },
          {
            name: dataFile['headers'][5],
            data: [
              parseInt(dataFile[9][2]),
              parseInt(dataFile[9][3]),
              parseInt(dataFile[9][4])
            ]
          }
        ]
      };*/
    });
  }

  async addDataToGraph(fileName) {
    return await this.getDataFile(fileName);
  }

  getDataFile(fileName) {
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Extrating data ...'
    });
    return new Promise(async resolve => {
      loader.present();
      let fileOpened = await this.fileNavigator.readAsText(
        this.fileNavigator.applicationDirectory + '/www/assets/downloaded/',
        fileName
      );
      const lines = fileOpened.split('\n');
      const headers = lines[1].split('\t');

      this.graphHeadersKeys = Object.keys(graphHeaders);

      headers.forEach((header, i) => {
        this.graphHeadersKeys.forEach(dataPerHeader => {
          if (header == dataPerHeader) {
            this.posColumns[header] = i;
            this.fileProvider.minVal[header] = parseFloat(lines[2].split('\t')[i]);
            this.fileProvider.maxVal[header] = parseFloat(lines[2].split('\t')[i]);
          }
        });
      });

      for (let i = 2; i < lines.length - 1; i++) {
        let segment = lines[i].split('\t');
        let nextSegment = lines[i + 1] ? lines[i + 1].split('\t') : {};
        this.graphHeadersKeys.forEach(val => {
          if (val !== 'CREATEDATE') {
            let intVal = parseFloat(segment[this.posColumns[graphHeaders[val]]]);
            if (intVal == null)
              intVal = 0;
            if (intVal < this.fileProvider.minVal[graphHeaders[val]])
              this.fileProvider.minVal[graphHeaders[val]] = intVal;
            if (intVal > this.fileProvider.maxVal[graphHeaders[val]])
              this.fileProvider.maxVal[graphHeaders[val]] = intVal;
          }
        });

        //this.getDataByHeaders(this.fileProvider, i, segment);

        //this.fileProvider.minVal[i] = this.fileProvider.dataColumns[i][this.fileProvider.headers[k]]
      }

      console.log(
        JSON.stringify(this.fileProvider.minVal[graphHeaders.AIR_TEMPERATURE])
      );
      console.log(
        JSON.stringify(this.fileProvider.maxVal[graphHeaders.AIR_TEMPERATURE])
      );
      console.log(
        JSON.stringify(this.fileProvider.minVal[graphHeaders.AIR_PRESSURE])
      );
      console.log(
        JSON.stringify(this.fileProvider.maxVal[graphHeaders.AIR_PRESSURE])
      );
      console.log(
        JSON.stringify(this.fileProvider.minVal[graphHeaders.LOCAL_WD_2MIN_MNM])
      );
      console.log(
        JSON.stringify(this.fileProvider.maxVal[graphHeaders.LOCAL_WD_2MIN_MNM])
      );
      console.log(
        JSON.stringify(this.fileProvider.minVal[graphHeaders.LOCAL_WS_2MIN_MNM])
      );
      console.log(
        JSON.stringify(this.fileProvider.maxVal[graphHeaders.LOCAL_WS_2MIN_MNM])
      );
      console.log(
        JSON.stringify(this.fileProvider.minVal[graphHeaders.REL_HUMIDITY])
      );
      console.log(
        JSON.stringify(this.fileProvider.maxVal[graphHeaders.REL_HUMIDITY])
      );

      loader.dismiss();
      resolve(this.fileProvider);
    });
  }

  getSelectVal() {
    console.log(this.type);
  }

  getDataByHeaders(fileProvider, i, segment) {
    for (let j in this.fileProvider.headers) {
      this.fileProvider.dataColumns[i][this.fileProvider.headers[j]] =
        segment[j];
    }
  }
}
