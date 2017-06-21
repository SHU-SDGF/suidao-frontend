import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ViewController, Events, Platform, AlertController, LoadingController, Loading} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility-insp-service';
import { LookupService } from '../../../providers/lookup-service';
import { MediaService } from '../../../providers/media-service';
import { InspSmrGroup, SyncDownloadService } from './sync-download.service';

import * as $ from 'jquery';

@Component({
  selector: 'mainyou-page',
  templateUrl: './sync-download.component.html',
  styles: ['../sync-download.component.scss']
})
export class SyncDownloadComponent implements OnInit {
  @ViewChild('header') _header: ElementRef;
  private facilityInspGroups: InspSmrGroup[] = [];
  private models = [];
  private monomers = [];

  public statusList = [{
    id: '1',
    name: '未开始'
  },{
    id: '3',
    name: '下载失败'
  }];

  constructor(
    private _viewCtrl: ViewController,
    private lookupService: LookupService,
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService,
    private events: Events,
    private platform: Platform,
    private _downloadService: SyncDownloadService,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController
  ){}

  ngOnInit() {
    
    if(this.platform.is('ios')){
      $(this._header.nativeElement).css({
        'paddingTop': '20px',
        'background-color': '#202737'
      });
    }
    this.facilityInspGroups = this._downloadService.getFacilityInspGroups();

    this.lookupService.getMenomers().then((monomers)=>{
      this.monomers = monomers;
    });
    this.lookupService.getModelNames().then((models)=>{
      this.models = models;
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  syncDownload(){
    try{
      let loader: Loading;
      this._downloadService.syncDownload()
        .subscribe((status)=>{
          switch (status) {
            case 'data_started':
              loader = this._loadingCtrl.create({
                content: '正在下载数据',
                showBackdrop: true
              });
              loader.present();
              break;
            case 'data_ready':
              if (loader) {
                loader.dismiss();
              }
              break;
            case 'media_ready':
              if (this.facilityInspGroups.length) {
                this._alertCtrl.create({
                  title: '数据同步完成，但是发生错误！',
                  buttons: ['确认']
                }).present();
              } else {
                this._alertCtrl.create({
                  title: '数据同步完成！',
                  buttons: ['确认']
                }).present();
              }
          }
        }, (err)=>{
          this._alertCtrl.create({
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