import {ViewController, NavParams, LoadingOptions, LoadingController, AlertController } from 'ionic-angular';
import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';

import {AppUtils, OptionPipe} from '../../../../../../shared/utils';
import {LookupService} from '../../../../../../providers/lookup_service';
import {FacilityInspService} from '../../../../../../providers/facility_insp_service';
import {UserService} from '../../../../../../providers';
import * as  _ from 'lodash';
import {MediaViewer} from '../../../../../../shared/components/media-viewer/media-viewer';
import {CaptureMedia} from '../../../../../../shared/components/media-capture/media-capture';
import {MediaContent} from '../../../../../../models/MediaContent';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_save/observ_save.html',
  pipes: [AppUtils.DatePipe, OptionPipe],
  directives: [MediaViewer, CaptureMedia]
})
export class ObservSavePage implements OnInit{
  private diseaseNo = '';
  private diseaseDetailObj: any = {};
  private diseaseTypeList: {
    name:string,
    id: string
  }[] = [];
  private tunnelOptions: any;
  private scannedInfo: any;
  private point: any;
  private photos: Array<MediaContent> = [];
  private diseaseInfo: {
    date: string,
    count: number
  }
  private detailTypeList: any;
  private isNewRecord = true;
  constructor(
    private _viewCtrl: ViewController, 
    private lookupService: LookupService, 
    private params: NavParams, 
    private facilityInspService: FacilityInspService, 
    private userService: UserService, 
    private loadingController: LoadingController, 
    private _alertController: AlertController
  ){}

  ngOnInit(){
    let diseaseNo = this.params.data.diseaseNo;

    this.diseaseInfo = this.params.data.diseaseInfo;
    this.point = this.params.data.point;
    this.diseaseTypeList = [this.params.data.diseaseType.diseaseType];
    this.isNewRecord = this.params.data.isNewRecord;
    this.facilityInspService.findFacilityInspByDiseaseNo(diseaseNo).then((result) => {
      if(result.docs > 0 ){
        this.isNewRecord = false;
      } else {
        this.diseaseDetailObj = {
          diseaseTypeId: this.diseaseTypeList[0]["id"],
          recorder: '',
          createUser: '',
          createDate: new Date().getTime(),
          needRepair: true,
          depth: 0,
          length: 0,
          area: 0,
          width: 0,
          jointopen: 0,
          dislocation: 0,
          longitude: this.point.longitude,
          latitude: this.point.latitude,
          diseaseNo: this.params.data.diseaseNo,
          diseaseDate: new Date().getTime(),
          diseaseDescription: '',
          displayDiseaseDate: new Date().toISOString().slice(0, 10),
          facilityType: "1",
          photo: [],
          photos: []
        };

        this.lookupService.getTunnelOption().then((result) => {
          console.log(result);
          this.tunnelOptions = result;
          this.diseaseDetailObj.monomerId = this.tunnelOptions["direction"]["id"];
          this.diseaseDetailObj.modelId =  this.tunnelOptions["struct"]["id"];
          this.diseaseDetailObj.displayModelName = this.tunnelOptions["direction"]["name"];
        });

        this.lookupService.getScannedInfo().then((result) => {
          this.scannedInfo = result;
          this.diseaseDetailObj.facilityId = this.scannedInfo["facilityId"];
          this.diseaseDetailObj.mileage = this.scannedInfo["mileage"];
        });

        this.userService.getUserInfo().then((userInfo) => {
          this.diseaseDetailObj.displayRecorder = userInfo.userName;
          this.diseaseDetailObj.recorder = userInfo.userName;
          this.diseaseDetailObj.createUser = userInfo.loginId;
        });

        this.lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailObj.diseaseTypeId).then((result) => {
          this.detailTypeList = result;
          this.diseaseDetailObj.detailTypeId = this.detailTypeList[0]["id"];
        });
      }
    }, (error) => {
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  /**
   * 获取多媒体文件
   */
  captureMedia(photo: MediaContent){
    this.photos.unshift(photo);
  }

  createDisease(){
    let that = this;
    let options: LoadingOptions = {};
    let loader = this.loadingController.create({
      dismissOnPageChange: true,
      duration: 500
    });
    this.diseaseDetailObj.synFlg = 1;
    this.diseaseDetailObj.photos = this.photos;
    loader.present();
    if(this.isNewRecord) {
      this.facilityInspService.addNewFacilityInspSummary(this.diseaseDetailObj).then((result) => {
        if(result.ok) {
          localStorage.setItem("createDiseaseInfo", JSON.stringify(this.diseaseInfo));
        }

        this.facilityInspService.addNewFacilityInspDetail(this.diseaseDetailObj, this.diseaseDetailObj.createUser).then((result) => {
           this._viewCtrl.dismiss(this.diseaseDetailObj);
        });
      },(error) => {
      });
    } else {
    }
  }
}
