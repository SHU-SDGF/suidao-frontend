import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService} from '../../../../../../providers';
import {AppUtils} from '../../../../../../shared/utils';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_info/activity_info.html',
  pipes: [AppUtils.DatePipe]
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
    private params: NavParams,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    let _self = this;
    let paramsObj = this.params.get('activityDetail');
    this.activityDetailObj = {
      actNo: paramsObj.actNo,
      actName: paramsObj.title, //活动名称
      description: paramsObj.description, //活动描述
      actStatus: paramsObj.actStatus,
      actType: paramsObj.actType,
      inspDate: AppUtils.convertDate(paramsObj.inspDate)
    };

    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
    });

    // 获取活动历史列表
    this._environmentActivityService.searchEnvironmentActivitiesByActNo(this.activityDetailObj.actNo).then((result) => {
      this.environmentActivityList = result["content"];
    }, (error) => {
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit() {
    let _that = this;
    let paramsObj = {
      actNo: this.activityDetailObj.actNo,
      actName: this.activityDetailObj.actName,
      description: this.activityDetailObj.description,
      actStatus: this.activityDetailObj.actStatus,
      actType: this.activityDetailObj.actType,
      recorder: this.activityDetailObj.recorder,
      inspDate: new Date(this.activityDetailObj.inspDate).getTime()
    }

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      duration: 2000
    });

    loading.present();

    this._environmentActivityService.addNewEnvironmentActivity(paramsObj).then((result) => {
      this.viewCtrl.dismiss(result);
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

  showHistory(el) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': el, 'activityName': this.activityDetailObj["actName"]});
    modal.present();
  }
}