import {Component, OnInit, NgZone,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController, Content} from 'ionic-angular';
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
  @ViewChild('content') content: Content;
  currentPageIndex = 0;


  private environmentActivityList: Array<EnvironmentActivity> = [];
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

    this._userService.getUserByID(this.activityDetailObj.createUser).subscribe((user)=>{
      this.activityDetailObj.createUsername = user.userName;
    });

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
      this.getHistory().then((result)=>{
        if(result.actList.length){
          let act = result.actList[0];
          this.activityDetailObj.actType = act.actType;
          this.activityDetailObj.inspDate = act.inspDate;
          this.activityDetailObj.description = act.description;
          this.activityDetailObj.actStatus = parseInt(act.actStatus);
        }
      });
    }, 200);
  }

  getHistory(pageIndex?){
    return new Promise <{actList: Array<EnvironmentActivity> , last: boolean}>((resolve, reject)=>{
      this.currentPageIndex++;
      
      // 获取活动历史列表
      this._environmentActivityService.searchEnvironmentActivitiesByActNo(this.activityDetailObj.actNo, pageIndex).subscribe((result) => {
        let actList = result.environmentActivityList;
        this.environmentActivityList.forEach(act=>{
          let index = actList.findIndex(a=>a.id == act.id)
          index > -1 && actList.splice(index, 1);
        })
        this.environmentActivityList = this.environmentActivityList.concat(actList);
        
        resolve({actList: actList , last: result.last});
      }, (error) => {
        let alert =this._alertController.create({
          title: '获取历史列表失败，请连续管理员！'
        });
        alert.present();
        alert.onDidDismiss(()=>{
          this.dismiss();
        });
        reject(error);
      });
    });
  }

  dismiss() {
    this._viewCtrl.dismiss(this.activityDetailObj);
  }

  edit() {
    let modal = this._modelCtrl.create(ActivityEditPage, {activityDetail: this.activityDetailObj});
    modal.present();
    modal.onDidDismiss((result: EnvironmentActivity)=>{
      if(!result) return;
      this.activityDetailObj.actStatus = parseInt(result.actStatus);
      this.activityDetailObj.actType = result.actType;
      this.activityDetailObj.inspDate = result.inspDate;
      this.activityDetailObj.description = result.description;

      this.environmentActivityList.unshift(result);
    });
  }

  showHistory(el) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage, {'activityDetail': el, 'activityName': this.activityDetailObj["actName"]});
    modal.present();
  }

  switchSegment($event){
    console.log($event);
    this.content.scrollToTop(0);
  }

  loadMore(infiniteScroll){
    this.getHistory(this.currentPageIndex).then((result)=>{
      if(result.last){
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    }, ()=>{
      infiniteScroll.complete();
    });
  }
}