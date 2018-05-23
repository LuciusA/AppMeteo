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
  posColumns: number[] = [];
  posMin: any[] = [];
  posMax: any[] = [];
  graphHeadersKeys: any[] = [];
  recapData: any;
  minVal: any[] = [];
  maxVal: any[] = [];
  minHour: any[] = [];
  maxHour: any[] = [];
  tempData: any[] = [];
  presData: any[] = [];
  relData: any[] = [];
  locWSData: any[] = [];
  locWDData: any[] = [];
  averageData: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform,
    public fileNavigator: File,
    public loadingCtrl: LoadingController,
    public fileProvider: FileProvider
  ) {
    this.drawChart();
  }

  drawChart() {
    this.navParams.get('fileName');
    this.addDataToGraph().then(dataFile => {
      this.recapData = dataFile;
      this.graphHeadersKeys.splice(2, 1);
      this.graphHeadersKeys.splice(4, 1);
      if (!this.type) this.type = this.graphHeadersKeys[0];
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

  async addDataToGraph() {
    return await this.getDataFile();
  }

  getDataFile() {
    const fileName = this.navParams.get('fileName');
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
            this.fileProvider.minVal[header] = parseFloat(
              lines[2].split('\t')[i]
            );
            this.fileProvider.maxVal[header] = parseFloat(
              lines[2].split('\t')[i]
            );
          }
        });
      });

      for (let i = 2; i < lines.length - 1; i++) {
        let segment = lines[i].split('\t');
        this.fileProvider.lines[i] = segment;
        //let nextSegment = lines[i + 1] ? lines[i + 1].split('\t') : {};
        this.graphHeadersKeys.forEach(val => {
          if (val !== 'CREATEDATE') {
            let intVal = parseFloat(
              segment[this.posColumns[graphHeaders[val]]]
            );
            if (intVal == null) intVal = 0;
            if (intVal < this.fileProvider.minVal[graphHeaders[val]]) {
              this.fileProvider.minVal[graphHeaders[val]] = intVal;
              this.posMin[graphHeaders[val]] = i;
            }
            if (intVal > this.fileProvider.maxVal[graphHeaders[val]]) {
              this.fileProvider.maxVal[graphHeaders[val]] = intVal;
              this.posMax[graphHeaders[val]] = i;
            }
            if (val == 'AIR_PRESSURE') this.presData.push(intVal);
            if (val == 'AIR_TEMPERATURE') this.tempData.push(intVal);
            if (val == 'REL_HUMIDITY') this.relData.push(intVal);
            if (val == 'LOCAL_WS_2MIN_MNM') this.locWSData.push(intVal);
            if (val == 'LOCAL_WD_2MIN_MNM') this.locWSData.push(intVal);
          }
        });
      }
      // console.log(JSON.stringify(this.presData));
      // console.log(JSON.stringify(this.tempData));
      // console.log(JSON.stringify(this.relData));
      // console.log(JSON.stringify(this.locData));

      this.averageData.push(
        Math.round(
          this.presData.reduce((a, b) => a + b, 0) / this.presData.length
        )
      );
      this.averageData.push(
        (
          this.tempData.reduce((a, b) => a + b, 0) / this.tempData.length
        ).toFixed(2)
      );
      this.averageData.push(
        Math.round(
          this.relData.reduce((a, b) => a + b, 0) / this.relData.length
        )
      );
      this.averageData.push(
        Math.round(
          this.locWSData.reduce((a, b) => a + b, 0) / this.locWSData.length
        ) +
          '(' +
          Math.round(
            this.locWDData.reduce((a, b) => a + b, 0) / this.locWDData.length
          ) +
          '°)'
      );

      this.minVal.push(this.fileProvider.minVal[graphHeaders.AIR_PRESSURE]);
      this.minVal.push(this.fileProvider.minVal[graphHeaders.AIR_TEMPERATURE]);
      this.minVal.push(this.fileProvider.minVal[graphHeaders.REL_HUMIDITY]);
      this.minVal.push(
        this.fileProvider.minVal[graphHeaders.LOCAL_WS_2MIN_MNM] +
          '(' +
          this.fileProvider.minVal[graphHeaders.LOCAL_WD_2MIN_MNM] +
          '°)'
      );

      this.maxVal.push(this.fileProvider.maxVal[graphHeaders.AIR_PRESSURE]);
      this.maxVal.push(this.fileProvider.maxVal[graphHeaders.AIR_TEMPERATURE]);
      this.maxVal.push(this.fileProvider.maxVal[graphHeaders.REL_HUMIDITY]);
      this.maxVal.push(
        this.fileProvider.maxVal[graphHeaders.LOCAL_WS_2MIN_MNM] +
          '(' +
          this.fileProvider.maxVal[graphHeaders.LOCAL_WD_2MIN_MNM] +
          '°)'
      );

      this.minHour.push(
        this.fileProvider.lines[this.posMin[graphHeaders.AIR_PRESSURE]][0]
      );
      this.minHour.push(
        this.fileProvider.lines[this.posMin[graphHeaders.AIR_TEMPERATURE]][0]
      );
      this.minHour.push(
        this.fileProvider.lines[this.posMin[graphHeaders.REL_HUMIDITY]][0]
      );
      this.minHour.push(
        this.fileProvider.lines[this.posMin[graphHeaders.LOCAL_WS_2MIN_MNM]][0]
      );

      this.maxHour.push(
        this.fileProvider.lines[this.posMax[graphHeaders.AIR_PRESSURE]][0]
      );
      this.maxHour.push(
        this.fileProvider.lines[this.posMax[graphHeaders.AIR_TEMPERATURE]][0]
      );
      this.maxHour.push(
        this.fileProvider.lines[this.posMax[graphHeaders.REL_HUMIDITY]][0]
      );
      this.maxHour.push(
        this.fileProvider.lines[this.posMax[graphHeaders.LOCAL_WS_2MIN_MNM]][0]
      );

      loader.dismiss();
      resolve(this.fileProvider);
    });
  }

  getSelectVal() {
    this.type;
    this.drawChart();
  }

  getAverageDay() {
    this.fileProvider.lines;
  }
}
