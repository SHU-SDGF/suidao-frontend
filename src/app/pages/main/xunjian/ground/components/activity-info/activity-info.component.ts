import { ActivityEditComponent } from '../activity-edit/activity-edit.component';
import { ActivityHistoryInfoComponent } from '../activity_history_info/activity-history-info.component';
import { EnvironmentActivityService } from '../../../../../../providers/environment-activity-service';
import { EnvironmentActivity } from '../../../../../../../models/EnvironmentActivity';
import {
  Component, OnInit, NgZone,
  ViewChild
} from '@angular/core';
import { ViewController, AlertController, NavParams, ModalController, LoadingController, Content } from 'ionic-angular';
import { LookupService, IActionStatus, IOption } from '../../../../../../providers/lookup-service';
import { AppUtils } from '../../../../../../shared/utils';
import { MediaService } from '../../../../../../providers/media-service';
import { FileService } from '../../../../../../providers/file-service';
import { UserService } from '../../../../../../providers/user-service';
import { MediaContent } from '../../../../../../../models/MediaContent';

@Component({
  templateUrl: './activity-info.component.html',
  styles: ['./activity-info.component.scss']
})
export class ActivityInfoComponent implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: any;
  actStatusList: Array<IActionStatus> = [];
  actTypes: Array<IOption> = [];
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
    private _zone: NgZone,
    private _mediaService: MediaService,
    private _fileService: FileService
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
      inspDate: AppUtils.convertDate(paramsObj.inspDate),
      createUser: paramsObj.createUser,
      startDate: paramsObj.startDate,
      endDate: paramsObj.endDate,
      recorder: '',
      medias: []
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
          this.updateActivity(result.actList[0])
        }
      });
    }, 200);
  }

  updateActivity(act){
    let _self = this;
    this.activityDetailObj.actType = act.actType;
    this.activityDetailObj.inspDate = act.inspDate;
    this.activityDetailObj.description = act.description;
    this.activityDetailObj.actStatus = act.actStatus;
    
    this.activityDetailObj.medias = getMedias(act.photo, 'img')
      .concat(getMedias(act.video, 'video'))
      .concat(getMedias(act.audio, 'audio'));

    function getMedias(urlList, type): Array<MediaContent> {
      if (!urlList) return [];
      
      return urlList.split(';').map((url) => {
        let media = new MediaContent({
          fileUri: url,
          mediaType: type,
          localUri: null
        });

        media.preview =  {
          'img': '',
          'audio': 'build/imgs/audio.png',
          'video': 'build/imgs/video.png'
        }[type];

        if(type == 'img'){
          _self._mediaService.getMediaPath(media).then((path)=>{
            media.preview = path;
          }, (err)=>{
            console.log(err);
          });
        }
        
        return media;
      });
    }
  }

  public async getHistory(pageIndex?) {
    try {
      this.currentPageIndex++;
      
      // 获取活动历史列表
      let result = await this._environmentActivityService.searchEnvironmentActivitiesByActNo(this.activityDetailObj.actNo, pageIndex)
      let actList = result.environmentActivityList;
      this.environmentActivityList.forEach(act => {
        let index = actList.findIndex(a => a.id == act.id)
        index > -1 && actList.splice(index, 1);
      })
      this.environmentActivityList = this.environmentActivityList.concat(actList);
        
      return { actList: actList, last: result.last };
    } catch (error) {
      let alert = this._alertController.create({
        title: '获取历史列表失败，请连续管理员！',
        buttons: [
          {
            text: '确定',
            role: 'cancel'
          }
        ]
      });
      alert.present();
      alert.onDidDismiss(() => {
        this.dismiss();
      });
      throw (error);
    }
  }

  dismiss() {
    this._viewCtrl.dismiss(this.activityDetailObj);
  }

  edit() {
    let modal = this._modelCtrl.create(ActivityEditComponent, {activityDetail: this.activityDetailObj});
    modal.present();
    modal.onDidDismiss((result: EnvironmentActivity)=>{
      if(!result) return;
      this.environmentActivityList.unshift(result);
      this.updateActivity(result);
    });
  }

  showHistory(el) {
    let modal = this._modelCtrl.create(ActivityHistoryInfoComponent, {'activityDetail': el, 'activityName': this.activityDetailObj["actName"]});
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