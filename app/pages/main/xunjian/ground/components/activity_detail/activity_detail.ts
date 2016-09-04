import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, LoadingController, ActionSheetController} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {MapPoint} from '../../../../../../shared/components/suidao-map/suidao-map';
import {LookupService} from '../../../../../../providers';
import {UserService} from '../../../../../../providers';
import { MediaCapture, ActionSheet, MediaFile } from 'ionic-native';
import {MediaViewer, IMediaContent} from '../../../../../../shared/components/media-viewer/media-viewer';

@Component({
  selector: 'activity-detail',
  templateUrl: './build/pages/main/xunjian/ground/components/activity_detail/activity_detail.html',
  directives: [MediaViewer]
})
export class ActivityDetailPage implements OnInit{
  
  private activityDetailObj: EnvironmentActivitySummary;
  medias: Array<IMediaContent> = [];

  private actStatusList: [{
    name: string,
    order: number
  }];

  private actTypes: [{
    name: string,
    order: number
  }];

  constructor(public viewCtrl: ViewController,
    private _activityDetail: EnvironmentActivityService,
    private _lookupService: LookupService,
    private _actService: EnvironmentActivityService,
    private _alertCtrl: AlertController,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private _userService: UserService,
    private _asCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    for(let i=0;i< 10;i++){
      this.medias.push({
        fileUri: 'https://unsplash.it/800?image=' + (i + 1),
        mediaType: 'img',
        preview: 'https://unsplash.it/800?image=' + (i + 1)
      });
    }

    let _self = this;
    let point: MapPoint = this.params.get('point');
    this.activityDetailObj = {
      actName: '', //活动名称
      description: '', //活动描述
      longitude: point.lng, //经度
      latitude: point.lat, //纬度
      actStatus: '',
      actType: '',
      recorder: '',
      startDate: new Date().toISOString().slice(0,10),
      endDate: new Date().toISOString().slice(0,10)
    };

    // username
    this._userService.getUsername().then((username) => {
      this.activityDetailObj.recorder = username;
    });

    // load status    
    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
      this.activityDetailObj.actStatus = _self.actStatusList[0].order;
    });


    this._lookupService.getActTypes().then((actTypes:[{name: string, order: number}]) => {
      _self.actTypes = actTypes;
    });
  }

  createActivity() {
    let activityObj = {
      environmentActitivitySummary: {
        actName: this.activityDetailObj.actName,
        description: this.activityDetailObj.description,
        longtitude: this.activityDetailObj.longitude,
        latitude: this.activityDetailObj.latitude,
        startDate: new Date(this.activityDetailObj.startDate).getTime(),
        endDate: new Date(this.activityDetailObj.endDate).getTime()
      },
      environmentActivity: {
        actType: this.activityDetailObj.actType,
        actStatus: this.activityDetailObj.actStatus,
        description: this.activityDetailObj.description,
        recorder: this.activityDetailObj.recorder,
        inspDate: new Date().getTime()
      }
    };

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });

    loading.present();
    
    this._actService.addNewEnvironmentActivitySummary(activityObj).then((result) => {
      this.viewCtrl.dismiss(result);
    }, (error) => {
      let alert = this._alertCtrl.create({
        title: '出错啦！',
        message: '创建活动未能成功！请重新尝试！'
      });
      alert.present();
    });
  }

  captureMedia(){
    ActionSheet.show({
      'title': "选择媒体种类",
      "buttonLabels": ['图片', '视频', '音频']
    }).then((buttonIndex: number) => {
      if(buttonIndex == 1){
        MediaCapture.captureImage().then((medieFiles: Array<MediaFile>) => {
          this.medias.unshift({
            fileUri: medieFiles[0].fullPath,
            mediaType: 'img',
            preview: medieFiles[0].fullPath
          });
        });
      }else if(buttonIndex == 2){
        MediaCapture.captureVideo().then((medieFiles: Array<MediaFile>)=>{
          this.medias.unshift({
            fileUri: medieFiles[0].fullPath,
            mediaType: 'video',
            preview: 'build/imgs/video.png'
          });
        });
      }else if(buttonIndex == 3){
        MediaCapture.captureAudio().then((medieFiles: Array<MediaFile>)=>{
          this.medias.unshift({
            fileUri: medieFiles[0].fullPath,
            mediaType: 'audio',
            preview: 'build/imgs/audio.png'
          });
        });
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}