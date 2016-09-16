import {Component, OnInit} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_upload/sync_upload.html'
})
export class SyncUploadPage implements OnInit {

  constructor(
    private _viewCtrl: ViewController
  ){}

  ngOnInit() {
    
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}