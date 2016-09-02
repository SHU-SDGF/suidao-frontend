import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {EnvironmentActivityService} from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService} from '../../../../../../providers';
import {AppUtils} from '../../../../../../shared/utils';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';


@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_edit/activity_edit.html',
  pipes: [AppUtils.DatePipe]
})
export class ActivityEditPage implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetail: EnvironmentActivity;
  activityDetailSummary: EnvironmentActivitySummary

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

    this.activityDetail = EnvironmentActivity.deserialize(paramsObj);
    this.activityDetailSummary = EnvironmentActivitySummary.deserialize(paramsObj);
    
    /*
    this.activityDetailObj = {
      actNo: paramsObj.actNo,
      actName: paramsObj.title, //活动名称
      description: paramsObj.description, //活动描述
      actStatus: paramsObj.actStatus,
      actType: paramsObj.actType,
      inspDate: this._convertDate(paramsObj.inspDate)
    };
    */

    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
    });

    // 获取活动历史列表
    this._environmentActivityService.searchEnvironmentActivitiesByActNo(this.activityDetail.actNo).then((result) => {
      this.environmentActivityList = result["content"];
    }, (error) => {
    });
  }

  private _convertDate(datetime) {
    let date = new Date(datetime)
    var month = (date.getMonth() + 1) > 9 ? '-' + (date.getMonth() + 1) : '-0' + (date.getMonth() + 1); 
    var day = (date.getDate()) > 9 ? '-' + (date.getDate()) : '-0' + (date.getDate()); 
    return date.getFullYear() + month + day;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    let _that = this;

    /*
    let paramsObj = {
      actNo: this.activityDetailObj.actNo,
      actName: this.activityDetailObj.actName,
      description: this.activityDetailObj.description,
      actStatus: this.activityDetailObj.actStatus,
      actType: this.activityDetailObj.actType,
      recorder: this.activityDetailObj.recorder,
      inspDate: new Date(this.activityDetailObj.inspDate).getTime()
    }
    */


    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      duration: 2000
    });

    loading.present();

    this._environmentActivityService.addNewEnvironmentActivity(this.activityDetail).then((result) => {
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

  showHistory(index) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': this.environmentActivityList[index], 'activityName': this.activityDetail["actName"]});
    modal.present();
  }
}