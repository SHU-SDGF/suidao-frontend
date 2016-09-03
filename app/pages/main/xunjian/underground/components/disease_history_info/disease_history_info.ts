import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {LookupService} from '../../../../../../providers';

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
  activityDetailObj: EnvironmentActivity;

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
      inspDate: this._convertDate(activityParams["inspDate"]),
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

  private _convertDate(datetime) {
    let date = new Date(datetime)
    var month = (date.getMonth() + 1) > 9 ? '-' + (date.getMonth() + 1) : '-0' + (date.getMonth() + 1); 
    var day = (date.getDate() + 1) > 9 ? '-' + (date.getDate()) : '-0' + (date.getDate()); 
    return date.getFullYear() + month + day;
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