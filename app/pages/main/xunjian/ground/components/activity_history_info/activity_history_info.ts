import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivityService} from '../../../../../../providers';
import {LookupService, IActionStatus, IOption} from '../../../../../../providers/lookup_service';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {AppUtils, DatePipe, OptionPipe} from '../../../../../../shared/utils';
import {StatusPicker } from '../../../../../../shared/components/status-picker/status-picker';
import {MediaContent} from '../../../../../../models/MediaContent';
import {MediaService} from '../../../../../../providers/media_service';
import {MediaViewer} from '../../../../../../shared/components/media-viewer/media-viewer';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_history_info/activity_history_info.html',
  pipes: [DatePipe, OptionPipe],
  directives: [MediaViewer, StatusPicker]
})
export class ActivityHistoryInfoPage implements OnInit{
  private actStatusList: Array<IActionStatus> = [];
  private actTypes: Array<IOption> = [];
  private activityDetailObj: EnvironmentActivity;
  private medias: Array<MediaContent>;
  private activityName: string;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private _lookupService: LookupService,
    private _mediaService: MediaService
  ) {}

  ngOnInit() {
    let _self = this;
    this._lookupService.getActionStatus().then((actStatusList) => {
      this.actStatusList = actStatusList;
    });

    this._lookupService.getActTypes().then((actTypes) => {
      this.actTypes = actTypes;
    });

    this.activityName = this.params.get('activityName');
    let activityParams = this.params.get('activityDetail');
    this.activityDetailObj = this.params.get('activityDetail');
    this.medias = getMedias(this.activityDetailObj.photo, 'img')
      .concat(getMedias(this.activityDetailObj.video, 'video'))
      .concat(getMedias(this.activityDetailObj.audio, 'audio'));

    function getMedias(urlList, type): Array<MediaContent> {
      if (!urlList) return [];
      
      return urlList.split(';').map((url) => {
        let media = new MediaContent({
          fileUri: url,
          mediaType: type,
          localUri: null
        });

        if(type == 'img'){
          _self._mediaService.getMediaPath(media).then((path)=>{
            media.preview = path;
          }, (err)=>{
            console.log(err);
          });
        }
        
        media.preview = {
          'img': '',
          'audio': 'build/imgs/audio.png',
          'video': 'build/imgs/video.png'
        }[type];
        
        return media;
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}