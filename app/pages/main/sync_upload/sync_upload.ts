import {Component, OnInit} from '@angular/core';
import {MenuController, ViewController} from 'ionic-angular';
import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';

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