import {Component, OnInit,
  ViewChild, } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {ViewController, AlertController, NavParams, LoadingController, ActionSheetController} from 'ionic-angular';
import {EnvironmentActivityService } from '../../../../../../providers';
import {MapPoint} from '../../../../../../shared/components/suidao-map/suidao-map';
import {LookupService, IActionStatus, IActionType} from '../../../../../../providers/lookup_service';
import {UserService} from '../../../../../../providers';
import { MediaCapture, ActionSheet, MediaFile } from 'ionic-native';
import {MediaViewer, IMediaContent} from '../../../../../../shared/components/media-viewer/media-viewer';
import {StatusPicker} from '../../../../../../shared/components/status-picker/status-picker';
import {CaptureMedia} from '../../../../../../shared/components/media-capture/media-capture';
import { FormValidors } from '../../../../../../providers/form-validators';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {DatePipe} from '../../../../../../shared/utils';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_detail/activity_detail.html',
  directives: [MediaViewer, CaptureMedia, StatusPicker, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  pipes: [DatePipe]
})
export class ActivityDetailPage implements OnInit{
  private submitAttempt = false;
  private activityForm: FormGroup = new FormGroup({});
  private medias: Array<IMediaContent> = [];
  private media: IMediaContent;

  private actStatusList: Array<IActionStatus>;

  private actTypes: Array<IActionType>;

  constructor(public viewCtrl: ViewController,
    private _activityDetail: EnvironmentActivityService,
    private _lookupService: LookupService,
    private _actService: EnvironmentActivityService,
    private _alertCtrl: AlertController,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private _userService: UserService,
    private _asCtrl: ActionSheetController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    let _self = this;
    let point: MapPoint = this.params.get('point');

    let formGroup = this.formBuilder.group({
      actName: ['', ...FormValidors.actNameValidator() ], //活动名称
      description: ['', ...FormValidors.descriptionValidator() ], //活动描述
      longitude: [point.lng], //经度
      latitude: [point.lat], //纬度
      actStatus: [0],
      recorder: [''],
      inspDate: [(new Date).getTime()],
      actType: [0, ...FormValidors.actTypeValidator()],
      startDate: [new Date().toISOString().slice(0,10), ...FormValidors.startDateValidator()],
      endDate: [new Date().toISOString().slice(0,10),  ...FormValidors.endDateValidator(this.activityForm)]
    });

    for(let key in formGroup.controls){
      this.activityForm.addControl(key, formGroup.controls[key]);
    }

    // username
    this._userService.getUserInfo().then((userInfo) => {
      (<FormControl>this.activityForm.controls['recorder']).updateValue(userInfo.userName, {onlySelf: true});
    });

    // load status    
    this._lookupService.getActionStatus().then((actStatusList) => {
      actStatusList.sort((a,b)=>{ return a.order > b.order? 1: -1;});
      _self.actStatusList = actStatusList;
      (<FormControl>this.activityForm.controls['actStatus']).updateValue(actStatusList[0].order, {onlySelf: true});
    });

    /// load activity types
    this._lookupService.getActTypes().then((actTypes) => {
      (<FormControl>this.activityForm.controls['actType']).updateValue(actTypes[0].order, {onlySelf: true});
      _self.actTypes = actTypes;
    });
  }

  /**
   * 创建活动
   */
  createActivity(activityObj) {
    this.submitAttempt = true;
    if(!this.activityForm.valid) return;

    activityObj.startDate = new Date(activityObj.startDate).getTime();
    activityObj.endDate = new Date(activityObj.endDate).getTime();

    let activityObjPayload = {
      environmentActitivitySummary: new EnvironmentActivitySummary(activityObj),
      environmentActivity: new EnvironmentActivity(activityObj)
    };
    

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });

    loading.present();
    
    this._actService.addNewEnvironmentActivitySummary(activityObjPayload).then((result) => {
      this.viewCtrl.dismiss(result);
    }, (error) => {
      loading.dismiss();
      let alert = this._alertCtrl.create({
        title: '出错啦！',
        message: '创建活动未能成功！请重新尝试！'
      });
      alert.present();
    });
  }

  /**
   * 获取多媒体文件
   */
  captureMedia(media: IMediaContent){
    this.medias.unshift(media);
  }

  /**
   * 消失
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}