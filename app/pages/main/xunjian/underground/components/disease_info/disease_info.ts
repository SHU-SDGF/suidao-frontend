import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {DiseaseHistoryInfoPage} from '../disease_history_info/disease_history_info';
import {LookupService} from '../../../../../../providers';
import {AppUtils} from '../../../../../../shared/utils';
import {FacilityInspSummary} from  '../../../../../../models/FacilityInspSummary';


@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/disease_info/disease_info.html',
  pipes: [AppUtils.DatePipe]
})
export class DiseaseInfoPage implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: EnvironmentActivitySummary;

  private actStatusList: [{
    name: string,
    order: number
  }];

  private actTypes: [{
    name: string,
    order: number
  }];

  private myDisease: FacilityInspSummary;

  private environmentActivityList: any = [];
  constructor(
    private viewCtrl: ViewController,
    private _modelCtrl: ModalController,
    private _lookupService: LookupService,
    private _alertController: AlertController,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    let _self = this;
    this.myDisease = this.params.get('disease');

    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
    });

    // 获取病害历史列表
    this._environmentActivityService.searchEnvironmentActivitiesByActNo('12016090112').then((result) => {
      this.environmentActivityList = result["content"];
    }, (error) => {
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit() {
    
  }

  private _getLookUpValue(list, order){
    let value = '';
    for(let el in list){
      if(list[el]["order"]  == order){
        value = list[el]["name"];
      }
    }
    return value;
  }

  showHistory(index) {
    let modal = this._modelCtrl.create(DiseaseInfoPage, {'activityDetail': this.environmentActivityList[index], 'activityName': this.activityDetailObj["actName"]});
    modal.present();
  }
}