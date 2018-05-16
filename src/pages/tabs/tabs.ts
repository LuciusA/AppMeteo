import { Component } from '@angular/core';

import { DownloadPage } from '../download/download';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DownloadPage;
  constructor() {

  }
}
