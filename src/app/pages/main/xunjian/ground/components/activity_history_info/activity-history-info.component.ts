import { EnvironmentActivity } from '../../../../../../../models/EnvironmentActivity';
import { Component, OnInit } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {LookupService, IActionStatus, IOption} from '../../../../../../providers/lookup-service';
import {MediaService} from '../../../../../../providers/media-service';
import { MediaContent } from '../../../../../../../models/MediaContent';

@Component({
  templateUrl: './activity-history-info.component.html',
  styles: ['./activity-history-info.component.scss']
})
export class ActivityHistoryInfoComponent implements OnInit{
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
          'audio': 'assets/imgs/audio.png',
          'video': 'assets/imgs/video.png'
        }[type];
        
        return media;
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}