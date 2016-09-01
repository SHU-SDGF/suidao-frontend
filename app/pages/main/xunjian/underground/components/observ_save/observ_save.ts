import {ViewController} from 'ionic-angular';
import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {AppUtils} from '../../../../../../shared/utils';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_save/observ_save.html',
  pipes: [AppUtils.DatePipe]
})
export class ObservSavePage implements OnInit{
  private diseaseDetailObj: any = {};


  constructor(private _viewCtrl: ViewController){

  }

  ngOnInit(){

  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  createDisease(){

  }
}
