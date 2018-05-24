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
  timeSeriesOptions: any;
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
  allPresSorted: any[] = [];
  allTempSorted: any[] = [];
  allRelSorted: any[] = [];
  allLocSorted: any[] = [];
  // allPresPerHour: any[] = [];
  // allTempPerHour: any[] = [];
  // allRelPerHour: any[] = [];
  // allLocPerHour: any[] = [];

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
      let min = [];
      let max = [];
      let avg = [];
      let minDay;
      let maxDay;
      let avgDay;
      let allData;
      let titleYAxis;
      if (this.type == 'AIR_PRESSURE') {
        titleYAxis = 'hPa';
        minDay = Math.round(this.minVal[0]);
        maxDay = Math.round(this.maxVal[0]);
        avgDay = Math.round(this.averageData[0]);
        allData = this.allPresSorted;

        for (let i = 0; i < 24; i++) {
          min.push(this.minPresPerHour[i]);
          max.push(this.maxPresPerHour[i]);
          avg.push(this.averagePresPerHour[i]);
          // allData.push(this.allPresPerHour[i]);
          // console.log(allData);
        }
      }
      if (this.type == 'AIR_TEMPERATURE') {
        titleYAxis = '° Celsius';
        minDay = Math.round(this.minVal[1]);
        maxDay = Math.round(this.maxVal[1]);
        avgDay = Math.round(this.averageData[1]);
        allData = this.allTempSorted;

        for (let i = 0; i < 24; i++) {
          min.push(this.minTempPerHour[i]);
          max.push(this.maxTempPerHour[i]);
          avg.push(this.averageTempPerHour[i]);
          //allData.push(this.allTempPerHour[i]);
        }
      }
      if (this.type == 'REL_HUMIDITY') {
        titleYAxis = '%';
        minDay = Math.round(this.minVal[2]);
        maxDay = Math.round(this.maxVal[2]);
        avgDay = Math.round(this.averageData[2]);
        allData = this.allRelSorted;

        for (let i = 0; i < 24; i++) {
          min.push(this.minRelPerHour[i]);
          max.push(this.maxRelPerHour[i]);
          avg.push(this.averageRelPerHour[i]);
          //allData.push(this.allRelPerHour[i]);
        }
      }
      if (this.type == 'LOCAL_WS_2MIN_MNM') {
        titleYAxis = 'nd';
        minDay = this.minVal[4];
        maxDay = this.maxVal[4];
        avgDay = this.averageData[4];
        allData = this.allLocSorted;

        for (let i = 0; i < 24; i++) {
          min.push(this.minLocPerHour[i]);
          max.push(this.maxLocPerHour[i]);
          avg.push(this.averageLocPerHour[i]);
          //allData.push(this.allLocPerHour[i]);
        }
      }
      this.chartOptions = {
        chart: {
          type: 'line'
        },
        title: {
          text: this.type
        },
        xAxis: {
          title: {
            text: 'Hours'
          }
        },
        yAxis: {
          title: {
            text: titleYAxis
          },
          plotLines: [
            {
              value: minDay,
              color: 'blue',
              dashStyle: 'shortdash',
              width: 2,
              label: {
                text: 'Min of Day'
              }
            },
            {
              value: maxDay,
              color: 'red',
              dashStyle: 'shortdash',
              width: 2,
              label: {
                text: 'Max of Day'
              }
            },
            {
              value: avgDay,
              color: 'yellow',
              dashStyle: 'shortdash',
              width: 2,
              label: {
                text: 'Average of Day'
              }
            }
          ]
        },
        series: [
          {
            name: 'Min per hour',
            data: min
          },
          {
            name: 'Max per hour',
            data: max
          },
          {
            name: 'Average per hour',
            data: avg
          }
        ]
      };
      this.timeSeriesOptions = {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: 'Data Total'
        },
        subtitle: {
          text:
            document.ontouchstart === undefined
              ? 'Click and drag in the plot area to zoom in'
              : 'Pinch the chart to zoom in'
        },
        xAxis: {
          title: {
            text: 'Occurency'
          }
        },
        yAxis: {
          title: {
            text: titleYAxis
          },
          min: allData[0]
        },
        legend: {
          enabled: false
        },
        // plotOptions: {
        //   area: {
        //     fillColor: {
        //       linearGradient: {
        //         x1: 0,
        //         y1: 0,
        //         x2: 0,
        //         y2: 1
        //       },
        //       stops: [
        //         [0, Highcharts.getOptions().colors[0]],
        //         [
        //           1,
        //           Highcharts.Color(Highcharts.getOptions().colors[0])
        //         ]
        //       ]
        //     },
        //     marker: {
        //       radius: 2
        //     },
        //     lineWidth: 1,
        //     states: {
        //       hover: {
        //         lineWidth: 1
        //       }
        //     },
        //     threshold: null
        //   }
        // },

        series: [
          {
            type: 'area',
            name: 'data',
            data: allData
          }
        ]
      };
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

      this.allPresSorted = this.presData.sort();
      this.allTempSorted = this.tempData.sort();
      this.allRelSorted = this.relData.sort();
      this.allLocSorted = this.locWSData.sort();

      let start = 0;
      let end = 720;
      for (let i = 0; i < 24; i++) {
        this.averagePresPerHour[i] = Math.round((
          this.presData.slice(start, end).reduce((a, b) => a + b, 0) /
            this.presData.slice(start, end).length) * 100
        ) / 100;
        this.averageTempPerHour[i] = Math.round((
          this.tempData.slice(start, end).reduce((a, b) => a + b, 0) /
          this.tempData.slice(start, end).length) * 100) / 100;

        this.averageRelPerHour[i] = Math.round((
          this.relData.slice(start, end).reduce((a, b) => a + b, 0) /
            this.relData.slice(start, end).length) * 100
        ) / 100;
        this.averageLocPerHour[i] = Math.round((
          this.locWSData.slice(start, end).reduce((a, b) => a + b, 0) /
          this.locWSData.slice(start, end).length) * 100) / 100;

        this.minPresPerHour[i] = Math.round((
          Math.min(...this.presData.slice(start, end))) * 100 ) / 100
        ;
        this.minTempPerHour[i] = Math.round((
          Math.min(...this.tempData.slice(start, end))) * 100 ) / 100
        ;
        this.minRelPerHour[i] = Math.round((
          Math.min(...this.relData.slice(start, end))) * 100 ) / 100
        ;
        this.minLocPerHour[i] = Math.round((Math.min(...this.locWSData.slice(start, end))) * 100 ) / 100;

        this.maxPresPerHour[i] = Math.round((
          Math.max(...this.presData.slice(start, end))) * 100 ) / 100;

        this.maxTempPerHour[i] =
          Math.round((Math.max(...this.tempData.slice(start, end))) * 100 ) / 100
        ;
        this.maxRelPerHour[i] = Math.round((
          Math.max(...this.relData.slice(start, end))) * 100 ) / 100;

        this.maxLocPerHour[i] =
          Math.round((Math.max(...this.locWSData.slice(start, end))) * 100 ) / 100
        ;
        // this.allPresPerHour[i] = this.presData.slice(start, end);
        // this.allTempPerHour[i] = this.tempData.slice(start, end);
        // this.allRelPerHour[i] = this.relData.slice(start, end);
        // this.allLocPerHour[i] = this.locWSData.slice(start, end);
        start = end;
        end = end + 720;
      }

      this.averageData.push(
        Math.round((
          this.presData.reduce((a, b) => a + b, 0) / this.presData.length
        ) * 100 ) / 100);
      this.averageData.push(
          Math.round((this.tempData.reduce((a, b) => a + b, 0) / this.tempData.length
          ) * 100 ) / 100
      );
      this.averageData.push(
        Math.round((
          this.relData.reduce((a, b) => a + b, 0) / this.relData.length
        ) * 100 ) / 100
      );
      this.averageData.push(
          Math.round((this.locWSData.reduce((a, b) => a + b, 0) / this.locWSData.length) * 100 ) / 100
        +
          '(' +
            Math.round((this.locWDData.reduce((a, b) => a + b, 0) / this.locWDData.length) * 100 ) / 100
           +
          '°)'
      );
      this.averageData.push(
          Math.round((this.locWSData.reduce((a, b) => a + b, 0) / this.locWSData.length) * 100 ) / 100
      );

      this.minVal.push(Math.round((this.fileProvider.minVal[graphHeaders.AIR_PRESSURE]) * 100 ) / 100);
      this.minVal.push(Math.round((this.fileProvider.minVal[graphHeaders.AIR_TEMPERATURE]) * 100 ) / 100);
      this.minVal.push(Math.round((this.fileProvider.minVal[graphHeaders.REL_HUMIDITY]) * 100 ) / 100);
      this.minVal.push(
        Math.round((this.fileProvider.minVal[graphHeaders.LOCAL_WS_2MIN_MNM]) * 100 ) / 100 +
          '(' +
          Math.round((this.fileProvider.minVal[graphHeaders.LOCAL_WD_2MIN_MNM]) * 100 ) / 100 +
          '°)'
      );
      this.minVal.push(
        Math.round((this.fileProvider.minVal[graphHeaders.LOCAL_WS_2MIN_MNM]
      ) * 100 ) / 100);

      this.maxVal.push(Math.round((this.fileProvider.maxVal[graphHeaders.AIR_PRESSURE]) * 100 ) / 100);
      this.maxVal.push(Math.round((this.fileProvider.maxVal[graphHeaders.AIR_TEMPERATURE]) * 100 ) / 100);
      this.maxVal.push(Math.round((this.fileProvider.maxVal[graphHeaders.REL_HUMIDITY]) * 100 ) / 100);
      this.maxVal.push(
        Math.round((this.fileProvider.maxVal[graphHeaders.LOCAL_WS_2MIN_MNM]) * 100 ) / 100 +
          '(' +
          Math.round((this.fileProvider.maxVal[graphHeaders.LOCAL_WD_2MIN_MNM]) * 100 ) / 100 +
          '°)'
      );
      this.maxVal.push(
        this.fileProvider.maxVal[graphHeaders.LOCAL_WS_2MIN_MNM]
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
}
