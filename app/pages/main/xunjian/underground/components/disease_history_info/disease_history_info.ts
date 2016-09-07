import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivityService } from '../../../../../../providers';
import {LookupService} from '../../../../../../providers';
import {AppUtils} from '../../../../../../shared/utils';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_history_info/activity_history_info.html'
})
export class DiseaseHistoryInfoPage implements OnInit{
  private actStatusList: [{
    name: string,
    order: number
  }];

  private actTypesList: [{
    name: string,
    order: number
  }];
  
  activityDetailObj: any;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private _lookupService: LookupService
  ) {}

  ngOnInit() {
    let _self = this;
    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
      _self.activityDetailObj["actStatus"] = _self._getLookUpValue(this.actStatusList, activityParams["actStatus"]);
    });

    this._lookupService.getActTypes().then((actTypesList:[{name: string, order: number}]) => {
      _self.actTypesList = actTypesList;
      _self.activityDetailObj["actType"] = _self._getLookUpValue(this.actTypesList, activityParams["actType"]);
    });

    let activityName = this.params.get('activityName');
    let activityParams = this.params.get('activityDetail');
    this.activityDetailObj = {
      actName: activityName,
      inspDate: AppUtils.convertDate(activityParams["inspDate"]),
      endDate: activityParams["endDate"],
      description: activityParams["description"], //活动描述
      actStatus: activityParams["actStatus"],
      recorder: activityParams["recorder"],
      photo: activityParams["photo"],
      audio: activityParams["audio"],
      video: activityParams["video"],
      actNo: activityParams["actNo"]
    };
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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}