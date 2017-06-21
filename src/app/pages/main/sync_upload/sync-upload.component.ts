import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ViewController, Events, LoadingController, AlertController, Platform } from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility-insp-service';
import { LookupService } from '../../../providers/lookup-service';
import { LocalNotifications } from 'ionic-native';
import { InspSmrGroup } from '../sync_download/sync-download.service';
import { SyncUploadService } from './sync-upload.service';

import * as $ from 'jquery';

@Component({
  selector: 'mainyou-page',
  templateUrl: './sync-upload.component.html',
  styles: ['./sync-upload.component.scss']
})
export class SyncUploadComponent implements OnInit {
  @ViewChild('header') _header: ElementRef;

  private facilityInspGroups: InspSmrGroup[] = [];
  private models = [];
  private monomers = [];

  public statusList = [{
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

  dismiss(){
    this._viewCtrl.dismiss();
  }

  syncUpload() {
    console.log('upload start');
    try{
      this._syncUploadService.uploadMedias().subscribe(()=>{
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
          text: '同步上传已完成！'
        }]);

      }, (err)=>{
        this._alertCtrl.create({
          title: '错误',
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
    }catch(err){

    }
  }
}