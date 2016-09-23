import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ViewController, Events, Platform, AlertController} from 'ionic-angular';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import { LookupService } from '../../../providers/lookup_service';
import * as  _ from 'lodash';
import {MediaContent} from '../../../models/MediaContent';
import {AppUtils, DatePipe, OptionPipe, KeysPipe} from '../../../shared/utils';
import {MediaService, DownloadTask, DownloadTaskProgress} from '../../../providers/media_service';
import {SyncDownloadService, InspSmrGroup} from './sync_download.service'; 

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_download/sync_download.html',
  pipes: [DatePipe, OptionPipe, KeysPipe]
})
export class SyncDownloadPage implements OnInit {
  @ViewChild('header') _header: ElementRef;
  private facilityInspGroups: InspSmrGroup[] = [];
  private statusList = [{
    id: '1',
    name: '未开始'
  },{
    id: '3',
    name: '上传失败'
  }];

  constructor(
    private _viewCtrl: ViewController,
    private lookupService: LookupService,
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService,
    private events: Events,
    private platform: Platform,
    private _downloadService: SyncDownloadService,
    private alertController: AlertController
  ){}

  ngOnInit() {
    
    if(this.platform.is('ios')){
      $(this._header.nativeElement).css({
        'paddingTop': '20px',
        'background-color': '#202737'
      });
    }
    this.facilityInspGroups = this._downloadService.getFacilityInspGroups();
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  syncDownload(){
    try{
      this._downloadService.syncDownload()
        .then(()=>{
          let alert = this.alertController.create({
            title: '数据同步完成！',
            buttons: ['确认']
          }).present();
        })
        .catch(()=>{
          let alert = this.alertController.create({
            title: '错误',
            subTitle: '同步过程中发生错误！请重新尝试！',
            buttons: ['确认']
          }).present();
        });
    }catch(err){
      console.log(err);
    }
    /*
    this._downloadService.downloadMedias().catch(function(error){
      let alert = this.alertController.create({
        title: '错误',
        subTitle: '同步数据出现错误，请重新同步数据',
        buttons: ['确认']
      });
    }.bind(this));
    */
  }
  
}