import {Component, OnInit,
  ViewChild, NgZone} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController, ActionSheetController} from 'ionic-angular';
import {EnvironmentActivityService} from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';
import {LookupService, IActionStatus, IOption} from '../../../../../../providers/lookup_service';
import {AppUtils} from '../../../../../../shared/utils';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {StatusPicker} from '../../../../../../shared/components/status-picker/status-picker';
import {FormBuilder, Validators, FormGroup, FormControl, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import { FormValidors } from '../../../../../../providers/form-validators';
import {UserService} from '../../../../../../providers';
import {MediaService, UploadTaskProgress} from '../../../../../../providers/media_service';
import {MediaViewer} from '../../../../../../shared/components/media-viewer/media-viewer';
import {CaptureMedia} from '../../../../../../shared/components/media-capture/media-capture';
import {MediaContent} from '../../../../../../models/MediaContent';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_edit/activity_edit.html',
  pipes: [AppUtils.DatePipe],
  directives: [StatusPicker, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, MediaViewer, CaptureMedia]
})
export class ActivityEditPage implements OnInit{
  
  private activityForm: FormGroup = new FormGroup({});
  private actStatusList: Array<IActionStatus>;
  private actTypes: Array<IOption>;
  private environmentActivityList: any = [];
  private medias: Array<MediaContent> = [];
  
  constructor(
    private viewCtrl: ViewController,
    private _modelCtrl: ModalController,
    private _lookupService: LookupService,
    private _alertController: AlertController,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private _actionSheetCtrl: ActionSheetController,
    private _mediaService: MediaService,
    private _zone: NgZone
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
      inspDate: [new Date().getTime()],
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

    /// load activity types
    this._lookupService.getActTypes().then((actTypes) => {
      _self.actTypes = actTypes;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save(formData) {
    let imgUrlList = [],
      videoUrlList = [],
      audioUrlList = [];

    let loadingOptions = {
      dismissOnPageChange: true,
      content: ''
    };

    let task = this._mediaService.uploadFiles(this.medias);
    let publisher = task.start();

    let loading = this.loadingCtrl.create(loadingOptions);
    loading.present();
    task.$progress.subscribe((progress: UploadTaskProgress)=>{
      this._zone.run(()=>{
        loadingOptions.content = getLoadingText(progress);
      });
    });

    publisher.subscribe((media) => {
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
        formData.photo = imgUrlList.join(';');
        formData.video = videoUrlList.join(';');
        formData.audio = audioUrlList.join(';');

        this._environmentActivityService.addNewEnvironmentActivity(formData).subscribe((result) => {
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
    }, (err)=>{
      console.log(err);
      loading.onDidDismiss(()=>{
        let alert = this._alertController.create({
          title: '上传文件失败！'
        });
        alert.present();
      });
      loading.dismiss();
    });

    function getLoadingText(progress: UploadTaskProgress){
      if(progress.fileIndex != progress.totalFiles){
        return `正在上传多媒体文件(${progress.fileIndex}/${progress.totalFiles}) ${ AppUtils.formatBytes( progress.loaded || 0, 1)}/${AppUtils.formatBytes( progress.total || 1, 1)}`;
      }else{
        return `正在上传数据`;
      }
    }
  }

    /**
   * 获取多媒体文件
   */
  captureMedia(media: MediaContent){
    this.medias.unshift(media);
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
}