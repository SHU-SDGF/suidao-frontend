import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService} from '../../../../../../providers';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_info/activity_info.html'
})
export class ActivityInfoPage implements OnInit{
  
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

  private environmentActivityList: any = [];
  constructor(
    private viewCtrl: ViewController,
    private _modelCtrl: ModalController,
    private _lookupService: LookupService,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams) { }

  ngOnInit() {
    let _self = this;
    let paramsObj = this.params.get('activityDetail');
    this.activityDetailObj = {
      act_no: paramsObj.actNo,
      act_name: paramsObj.title, //活动名称
      description: paramsObj.description, //活动描述
      longitude: paramsObj.longitude, //经度
      latitude: paramsObj.latitude, //纬度
      act_status: paramsObj.actStatus,
      act_type: paramsObj.actType,
      recorder: paramsObj.recorder
    };

    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
    });

    // 获取活动历史列表
    this._environmentActivityService.searchEnvironmentActivitiesByActNo(this.activityDetailObj.act_no).then((result) => {
      this.environmentActivityList = result["content"];
    }, (error) => {
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showHistory(index) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': this.environmentActivityList[index], 'activityName': this.activityDetailObj["act_name"]});
    modal.present();
  }
}