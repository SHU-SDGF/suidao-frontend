import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {EnvironmentActivityService} from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService, IActionStatus, IActionType} from '../../../../../../providers/lookup_service';
import {AppUtils} from '../../../../../../shared/utils';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {StatusPicker} from '../../../../../../shared/components/status-picker/status-picker';
import {FormBuilder, Validators, FormGroup, FormControl, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import { FormValidors } from '../../../../../../providers/form-validators';
import {UserService} from '../../../../../../providers';
import {MediaViewer, IMediaContent} from '../../../../../../shared/components/media-viewer/media-viewer';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_edit/activity_edit.html',
  pipes: [AppUtils.DatePipe],
  directives: [StatusPicker, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, MediaViewer]
})
export class ActivityEditPage implements OnInit{
  
  private activityForm: FormGroup = new FormGroup({});
  private actStatusList: Array<IActionStatus>;
  private actTypes: [IActionType];
  private environmentActivityList: any = [];
  private medias: Array<IMediaContent> = [];
  
  constructor(
    private viewCtrl: ViewController,
    private _modelCtrl: ModalController,
    private _lookupService: LookupService,
    private _alertController: AlertController,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private _userService: UserService
  ) { }

  ngOnInit() {
    let _self = this;
    let activityDetailObj = this.params.get('activityDetail');

    this._lookupService.getActionStatus().then((actStatusList) => {
      _self.actStatusList = actStatusList;
    });

    let formGroup = this.formBuilder.group({
      actNo: [activityDetailObj.actNo],
      actName: [activityDetailObj.actName, ...FormValidors.actNameValidator() ], //活动名称
      description: ['', ...FormValidors.descriptionValidator() ], //活动描述
      actStatus: [activityDetailObj.actStatus],
      createUser: [activityDetailObj.createUser],
      recorder: [''],
      inspDate: [new Date(activityDetailObj.inspDate).getTime()],
      actType: [activityDetailObj.actType, ...FormValidors.actTypeValidator()],
      startDate: [AppUtils.convertDate(activityDetailObj.startDate), ...FormValidors.startDateValidator()],
      endDate: [AppUtils.convertDate(activityDetailObj.endDate),  ...FormValidors.endDateValidator(this.activityForm)]
    });

    for(let key in formGroup.controls){
      this.activityForm.addControl(key, formGroup.controls[key]);
    }

    // username
    this._userService.getUserInfo().then((userInfo) => {
      (<FormControl>this.activityForm.controls['recorder']).updateValue(userInfo.userName, {onlySelf: true});
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save(value) {

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '正在保存活动'
    });

    loading.present();

    this._environmentActivityService.addNewEnvironmentActivity(value).then((result) => {
      result['description'] = this.activityForm.controls['description'].value;
      loading.onDidDismiss(()=>{
        this.viewCtrl.dismiss(result);
      });
      loading.dismiss();
    }, (error) => {
      loading.onDidDismiss(()=>{
        let alert = this._alertController.create({
          title: '出错啦！',
          message: '创建活动未能成功！请重新尝试！'
        });
        alert.present();
      });
      loading.dismiss();
    });
  }

    /**
   * 获取多媒体文件
   */
  captureMedia(media: IMediaContent){
    this.medias.unshift(media);
  }
}