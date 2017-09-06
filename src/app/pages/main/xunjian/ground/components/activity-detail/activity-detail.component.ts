import { EnvironmentActivitySummary } from '../../../../../../../models/EnvironmentActivitySummary';
import { EnvironmentActivity } from '../../../../../../../models/EnvironmentActivity';
import {
  Component, OnInit,
  NgZone
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ViewController, AlertController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { LookupService, IActionStatus, IOption } from '../../../../../../providers/lookup-service';
import { FormValidors } from '../../../../../../providers/form-validators';
import { AppUtils} from '../../../../../../shared/utils';
import { MediaService, UploadTaskProgress } from '../../../../../../providers/media-service';
import { MediaContent } from '../../../../../../../models/MediaContent';
import { EnvironmentActivityService } from '../../../../../../providers/environment-activity-service';
import { UserService } from '../../../../../../providers/user-service';
import { MapPoint } from '../../../../../../shared/components/suidao-map/suidao-map.component';

@Component({
  templateUrl: './activity-detail.component.html',
  styles: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit{
  private submitAttempt = false;
  private activityForm: FormGroup = new FormGroup({});
  private medias: Array<MediaContent> = [];

  private actStatusList: Array<IActionStatus>;

  private actTypes: Array<IOption>;

  constructor(public viewCtrl: ViewController,
    private _lookupService: LookupService,
    private _actService: EnvironmentActivityService,
    private _alertCtrl: AlertController,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private _userService: UserService,
    private _asCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private _mediaService: MediaService,
    private _actionSheetCtrl: ActionSheetController,
    private _zone: NgZone
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
      (<FormControl>this.activityForm.controls['recorder']).setValue(userInfo.userName, {onlySelf: true});
    });

    // load status    
    this._lookupService.getActionStatus().then((actStatusList) => {
      actStatusList.sort((a,b)=>{ return a.order > b.order? 1: -1;});
      _self.actStatusList = actStatusList;
      (<FormControl>this.activityForm.controls['actStatus']).setValue(actStatusList[0].id, {onlySelf: true});
    });

    /// load activity types
    this._lookupService.getActTypes().then((actTypes: IOption[]) => {
      (<FormControl>this.activityForm.controls['actType']).setValue(actTypes[0].id, {onlySelf: true});
      _self.actTypes = actTypes;
    });
  }

  /**
   * 创建活动
   */
  createActivity(activityObj) {
    this.submitAttempt = true;
    if(!this.activityForm.valid) return;

    let task = this._mediaService.uploadFiles(this.medias);
    let publisher = task.start();
    let imgUrlList = [],
      videoUrlList = [],
      audioUrlList = [];


    let loadingOptions = {
      dismissOnPageChange: true,
      content: ''
    };

    let loading = this.loadingCtrl.create(loadingOptions);
    loading.present();
    task.$progress.subscribe((progress: UploadTaskProgress)=>{
      loadingOptions.content = getLoadingText(progress);
    });

    publisher.subscribe(async (media) => {
      if (media && media.fileUri) {
        switch (media.mediaType) {
          case 'img':
            imgUrlList.push(media.fileUri);
            break;
          case 'video':
            videoUrlList.push(media.fileUri);
            break;
          case 'audio':
            audioUrlList.push(media.fileUri);
            break;
        }
      }
      if (task.successFiles.length == task.files.length) {
        activityObj.photo = imgUrlList.join(';');
        activityObj.video = videoUrlList.join(';');
        activityObj.audio = audioUrlList.join(';');

        try {
          let result = await this.submitForm(activityObj);
          loading.onDidDismiss(()=>{
            this.viewCtrl.dismiss(result);
          });
          loading.dismiss();
        } catch (error) {
          this._zone.run(()=>{
            loadingOptions.content = '创建活动未能成功！请重新尝试！'
          });
          setTimeout(()=>{
            loading.dismiss();
          }, 2000);
        }
      }
    }, (error)=>{
      console.log(error);
      loading.dismiss();
      loading.onDidDismiss(()=>{
        let alert = this._alertCtrl.create({
          title: '上传文件失败！',
          buttons: [
            {
              text: '确定',
              role: 'cancel'
            }
          ]
          //message: JSON.stringify(error)
        });
        alert.present();
      });
    });

    function getLoadingText(progress: UploadTaskProgress){
      if(progress.fileIndex != progress.totalFiles){
        return `正在上传多媒体文件(${progress.fileIndex}/${progress.totalFiles}) ${ AppUtils.formatBytes( progress.loaded || 0, 1)}/${AppUtils.formatBytes( progress.total || 1, 1)}`;
      }else{
        return `正在上传数据`;
      }
    }
  }

  mediaLongClick(media: MediaContent){
    this._actionSheetCtrl.create({
      title: '操作',
      buttons: [
        {
          text: '删除',
          handler: () => {
            this.medias.splice(this.medias.indexOf(media), 1);
            this._mediaService.removeMedia(media);
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }

  submitForm(activityObj){
    activityObj.startDate = new Date(activityObj.startDate).getTime();
    activityObj.endDate = new Date(activityObj.endDate).getTime();

    let activityObjPayload = {
      environmentActitivitySummary: new EnvironmentActivitySummary(activityObj),
      environmentActivity: new EnvironmentActivity(activityObj)
    };

    return this._actService.addNewEnvironmentActivitySummary(activityObjPayload);
  }

  /**
   * 获取多媒体文件
   */
  captureMedia(media: MediaContent){
    this.medias.unshift(media);
  }

  /**
   * 消失
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}