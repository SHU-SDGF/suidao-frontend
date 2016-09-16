import {Component, OnInit} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_download/sync_download.html'
})
export class SyncDownloadPage implements OnInit {

  constructor(
    private _viewCtrl: ViewController
  ){}

  ngOnInit() {
    
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}