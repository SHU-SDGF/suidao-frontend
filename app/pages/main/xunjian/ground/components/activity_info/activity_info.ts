import {Component, OnInit, NgZone,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {EnvironmentActivityService } from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService, IActionStatus, IActionType} from '../../../../../../providers/lookup_service';
import {AppUtils, OptionPipe, StatusPipe} from '../../../../../../shared/utils';
import {UserService} from '../../../../../../providers';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {ActivityEditPage} from '../activity_edit/activity_edit';
import {StatusPicker} from '../../../../../../shared/components/status-picker/status-picker';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_info/activity_info.html',
  pipes: [AppUtils.DatePipe, OptionPipe, StatusPipe],
  directives: [StatusPicker]
})
export class ActivityInfoPage implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: any;
  actStatusList: Array<IActionStatus> = [];
  actTypes: Array<IActionType> = [];

  private environmentActivityList: any = [];
  constructor(
    private _viewCtrl: ViewController,
    private _modelCtrl: ModalController,
    private _lookupService: LookupService,
    private _alertController: AlertController,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams,
    private _loadingCtrl: LoadingController,
    private _userService: UserService,
    private _zone: NgZone
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

    this._lookupService.getActTypes().then((actTypeList)=>{
      _self.actTypes = actTypeList;
    });
    setTimeout(()=>{
      this.getHistory();
    }, 200);
  }

  getHistory(){

    // 获取活动历史列表
    this._environmentActivityService.searchEnvironmentActivitiesByActNo(this.activityDetailObj.actNo).then((result: any) => {
      this.environmentActivityList = result["content"];
      if(result.content.length){
        Object.assign(this.activityDetailObj, result.content[0]); 
        this.activityDetailObj.actStatus = parseInt(this.activityDetailObj.actStatus);
      }
    }, (error) => {
      let alert =this._alertController.create({
        title: '获取历史列表失败，请连续管理员！'
      });
      alert.present();
      alert.onDidDismiss(()=>{
        this.dismiss();
      });
    });
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }

  edit() {
    let modal = this._modelCtrl.create(ActivityEditPage, {activityDetail: this.activityDetailObj});
    modal.present();
    modal.onDidDismiss((result)=>{
      if(!result) return;
      Object.assign(this.activityDetailObj, result); 
      this.getHistory();
    });
  }

  showHistory(el) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': el, 'activityName': this.activityDetailObj["actName"]});
    modal.present();
  }

  loadMore(){
    console.log('123');
  }
}