import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ViewController, Events, LoadingController, AlertController, Platform} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import * as  _ from 'lodash';
import { LookupService } from '../../../providers/lookup_service';
import {AppUtils, DatePipe, OptionPipe, KeysPipe} from '../../../shared/utils';
import {MediaService} from '../../../providers/media_service';
import {MediaContent} from '../../../models/MediaContent';
import {SyncUploadService, InspSmrGroup} from './sync_upload.service';
import { LocalNotifications } from 'ionic-native';

declare const $;

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_upload/sync_upload.html',
  pipes: [DatePipe, OptionPipe, KeysPipe]
})
export class SyncUploadPage implements OnInit {
  @ViewChild('header') _header: ElementRef;

  private loader = null;
  private facilityInspGroups: InspSmrGroup[] = [];
  private monomers = [];
  private models = [];
  private statusList = [{
    id: '1',
    name: '未开始'
  },{
    id: '3',
    name: '上传失败'
  }];

  constructor(
    private _viewCtrl: ViewController,
    private facilityInspService: FacilityInspService,
    private events: Events,
    private loadingController: LoadingController,
    private lookupService: LookupService,
    private _alertCtrl: AlertController,
    private _syncUploadService: SyncUploadService,
    private platform: Platform
  ){}

  ngOnInit() {
    if(this.platform.is('ios')){
      $(this._header.nativeElement).css({
        'paddingTop': '20px',
        'background-color': '#202737'
      });
    }
    
    this.lookupService.getMenomers().then((monomers)=>{
      this.monomers = monomers;
    });
    this.lookupService.getModelNames().then((models)=>{
      this.models = models;
    });
    
    this._syncUploadService.getFacilityInspGroups().then((groups)=>{
      this.facilityInspGroups = groups;
    });
  }

  private getStatusAttr(statusID){
    return ['grey', 'warning', 'danger'][statusID - 1];
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  syncUpload() {
    console.log('upload start');
    this._syncUploadService.uploadMedias().then(()=>{
      this._alertCtrl.create({
        title: '同步上传已完成',
        buttons: [
          {
            text: '确定',
            role: 'cancel'
          }
        ]
      }).present();

      LocalNotifications.schedule([{
        id: ~~(Math.random()*100000),
        text: '同步上传已完成'
      }]);

    }, (err)=>{
      this._alertCtrl.create({
        title: '出错啦！',
        message: '同步过程中发生错误！请重新尝试！',
        buttons: [
          {
            text: '确定',
            role: 'cancel'
          }
        ]
      }).present();
      console.log(err);
    })
  }

}