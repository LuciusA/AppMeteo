
import { Injectable } from '@angular/core';

/*
  Generated class for the FileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export let graphHeaders = {
  AIR_PRESSURE: 'AIR_PRESSURE',
  AIR_TEMPERATURE: 'AIR_TEMPERATURE',
  CREATEDATE: 'CREATEDATE',
  REL_HUMIDITY: 'REL_HUMIDITY',
  LOCAL_WS_2MIN_MNM: 'LOCAL_WS_2MIN_MNM',
  LOCAL_WD_2MIN_MNM: 'LOCAL_WD_2MIN_MNM'
};
@Injectable()
export class FileProvider {
  headers: any[] = [];
  dataColumns: any;
  minVal: any[] = [];
  maxVal: any[] = [];
  posColumns: any[] = [];

  constructor() {
    console.log('Hello FileProvider Provider');
  }

}
