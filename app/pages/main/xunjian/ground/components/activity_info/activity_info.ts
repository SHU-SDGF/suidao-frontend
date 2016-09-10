import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {EnvironmentActivityService } from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService} from '../../../../../../providers';
import {AppUtils, OptionPipe} from '../../../../../../shared/utils';
import {UserService} from '../../../../../../providers';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {ActivityEditPage} from '../activity_edit/activity_edit';
import {StatusPicker} from '../../../../../../shared/components/status-picker/status-picker';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_info/activity_info.html',
  pipes: [AppUtils.DatePipe, OptionPipe],
  directives: [StatusPicker]
})
export class ActivityInfoPage implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: any;

  private actStatusList: Array<{
    name: string,
    order: number,
    color: string
  }>;

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
    private loadingCtrl: LoadingController,
    private _userService: UserService
  ) { }

  ngOnInit() {
    let _self = this;
    let paramsObj = this.params.get('activityDetail');
    this.activityDetailObj = {
      actNo: paramsObj.actNo,
      actName: paramsObj.title, //活动名称
      description: paramsObj.description, //活动描述
      actStatus: parseInt(paramsObj.actStatus),
      actType: paramsObj.actType,
      inspDate: AppUtils.convertDate(paramsObj.inspDate),
      createUser: paramsObj.createUser,
      startDate: paramsObj.startDate,
      endDate: paramsObj.endDate,
      recorder: ''
    };

    // username
    this._userService.getUserInfo().then((userInfo) => {
      this.activityDetailObj.recorder = userInfo.userName;
      this.activityDetailObj.createUser = userInfo.userName;
    });

    this._lookupService.getActionStatus().then((actStatusList) => {
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
    let modal = this._modelCtrl.create(ActivityEditPage, {activityDetail: this.activityDetailObj});
    modal.present();

    /*
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
      duration: 2000
    });

    loading.present();

    this._environmentActivityService.addNewEnvironmentActivity(paramsObj).then((result) => {
      loading.dismiss();
      this.viewCtrl.dismiss(result);
    }, (error) => {
      loading.dismiss();
      let alert = this._alertController.create({
        title: '出错啦！',
        message: '创建活动未能成功！请重新尝试！'
      });
      alert.present();
    });
    */
  }

  showHistory(el) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': el, 'activityName': this.activityDetailObj["actName"]});
    modal.present();
  }
}