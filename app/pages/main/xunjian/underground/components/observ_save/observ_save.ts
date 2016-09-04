import {ViewController, NavParams} from 'ionic-angular';
import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';

import {AppUtils} from '../../../../../../shared/utils';
import {LookupService} from '../../../../../../providers/lookup_service';


@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_save/observ_save.html',
  pipes: [AppUtils.DatePipe]
})
export class ObservSavePage implements OnInit{
  private diseaseDetailObj: any = {};

  private diseaseTypeList: [{
    name:string,
    id: string
  }];

  private detailTypeList: any;


  constructor(private _viewCtrl: ViewController, private lookupService: LookupService, private params: NavParams){

  }

  ngOnInit(){
    this.diseaseTypeList = [this.params.data.diseaseType.diseaseType];
    this.diseaseDetailObj.diseaseType = this.diseaseTypeList[0]["id"];
    this.detailTypeList = this.lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailObj.diseaseType);
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  createDisease(){
    this._viewCtrl.dismiss(this.diseaseDetailObj);
  }
}
