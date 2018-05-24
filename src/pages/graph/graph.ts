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
  averagePresPerHour: any[] = [];
  averageTempPerHour: any[] = [];
  averageRelPerHour: any[] = [];
  averageLocPerHour: any[] = [];
  minPresPerHour: any[] = [];
  minTempPerHour: any[] = [];
  minRelPerHour: any[] = [];
  minLocPerHour: any[] = [];
  maxPresPerHour: any[] = [];
  maxTempPerHour: any[] = [];
  maxRelPerHour: any[] = [];
  maxLocPerHour: any[] = [];

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
    //this.navParams.get('fileName');
    this.addDataToGraph().then(dataFile => {
      this.recapData = dataFile;
      this.graphHeadersKeys.splice(2, 1);
      this.graphHeadersKeys.splice(4, 1);
      if (!this.type) this.type = this.graphHeadersKeys[0];
      console.log(this.graphHeadersKeys[1]);
      if (this.type == 'AIR_PRESSURE') {
        let dataSeries = [];
        for (let i = 0; i < 24; i++) {
          dataSeries.push(this.minPresPerHour[i]);
        }
        this.chartOptions = {
          chart: {
            type: 'line'
          },
          title: {
            text: this.type
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
              name: 'Min per hour',
              data: dataSeries
            },
            {
              name: 'Max per hour',
              data: [this.maxPresPerHour]
            }
          ]
        };
      }
    });
  }

  async addDataToGraph() {
    return await this.getDataFile();
  }

  getDataFile() {
    const fileName = this.navParams.get('fileName');
    console.log(fileName);
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
        this.graphHeadersKeys.forEach(val => {
          if (val !== 'CREATEDATE') {
            let intVal = parseFloat(
              segment[this.posColumns[graphHeaders[val]]]
            );
            if (!intVal) {
              intVal = 0;
            }
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
            if (val == 'LOCAL_WD_2MIN_MNM') this.locWDData.push(intVal);
          }
        });
      }

      let start = 0;
      let end = 720;
      for (let i = 0; i < 24; i++) {
        this.averagePresPerHour[i] = Math.round(
          this.presData.slice(start, end).reduce((a, b) => a + b, 0) /
            this.presData.slice(start, end).length
        );
        this.averageTempPerHour[i] = Math.round(
          this.tempData.slice(start, end).reduce((a, b) => a + b, 0) /
            this.tempData.slice(start, end).length
        );
        this.averageRelPerHour[i] = Math.round(
          this.relData.slice(start, end).reduce((a, b) => a + b, 0) /
            this.relData.slice(start, end).length
        );
        this.averageLocPerHour[i] = Math.round(
          this.locWSData.slice(start, end).reduce((a, b) => a + b, 0) /
            this.locWSData.slice(start, end).length
        );
        this.minPresPerHour[i] = Math.min(...this.presData.slice(start, end));
        this.minTempPerHour[i] = Math.min(...this.tempData.slice(start, end));
        this.minRelPerHour[i] = Math.min(...this.relData.slice(start, end));
        this.minLocPerHour[i] = Math.min(...this.locWSData.slice(start, end));
        this.maxPresPerHour[i] = Math.max(...this.presData.slice(start, end));
        this.maxTempPerHour[i] = Math.max(...this.tempData.slice(start, end));
        this.maxRelPerHour[i] = Math.max(...this.relData.slice(start, end));
        this.maxLocPerHour[i] = Math.max(...this.locWSData.slice(start, end));
        start = end;
        end = end + 720;
      }

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
