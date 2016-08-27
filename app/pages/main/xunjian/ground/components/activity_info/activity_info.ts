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
    private _alertController: AlertController,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams) { }

  ngOnInit() {
    let _self = this;
    let paramsObj = this.params.get('activityDetail');
    this.activityDetailObj = {
      act_no: paramsObj.actNo,
      act_name: paramsObj.title, //活动名称
      description: paramsObj.description, //活动描述
      act_status: paramsObj.actStatus,
      act_type: paramsObj.actType,
      insp_date: this._convertDate(paramsObj.inspDate)
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

  private _convertDate(datetime) {
    let date = new Date(datetime)
    return date.getFullYear() + '-0' + (date.getMonth() + 1) + '-0' + (date.getDay() + 1)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit() {
    let _that = this;
    let paramsObj = {
      actNo: this.activityDetailObj.act_no,
      actName: this.activityDetailObj.act_name,
      description: this.activityDetailObj.description,
      actStatus: this.activityDetailObj.act_status,
      actType: this.activityDetailObj.act_type,
      recorder: this.activityDetailObj.recorder,
      inspDate: new Date(this.activityDetailObj.insp_date).getTime()
    }
    this._environmentActivityService.addNewEnvironmentActivity(paramsObj).then((result) => {
      this.viewCtrl.dismiss();
    }, (error) => {
      let alert = this._alertController.create({
        title: '出错啦！',
        message: '创建活动未能成功！请重新尝试！'
      });
      alert.present();
    });
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
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': this.environmentActivityList[index], 'activityName': this.activityDetailObj["act_name"]});
    modal.present();
  }
}