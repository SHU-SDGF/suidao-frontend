import { UserService } from '../../../../../../providers/user-service';
import { FacilityInspService } from '../../../../../../providers/facility-insp-service';
import { LookupService } from '../../../../../../providers/lookup-service';
import { AlertController, Events, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';

import { MediaContent } from '../../../../../../../models/MediaContent';

@Component({
  templateUrl: './observ-save.component.html',
  styles: ['./observ-save.component.scss']
})
export class ObservSaveComponent implements OnInit{
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
    private _alertController: AlertController,
    private _event: Events,
  ){}

  public async ngOnInit() {
    let diseaseNo = this.params.data.diseaseNo;

    this.diseaseInfo = this.params.data.diseaseInfo;
    this.point = this.params.data.point;
    this.diseaseTypeList = [this.params.data.diseaseType.diseaseType];
    this.isNewRecord = this.params.data.isNewRecord;
    let summary = await this.facilityInspService.findFacilityInspByDiseaseNo(diseaseNo);
    if (summary) {
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
        diseaseDescription: ' ',
        displayDiseaseDate: new Date().toISOString().slice(0, 10),
        facilityType: "1",
        photo: '',
        photos: []
      };

      this.lookupService.getTunnelOption().then((result) => {
        console.log(result);
        this.tunnelOptions = result;
        this.diseaseDetailObj.monomerId = this.tunnelOptions["direction"]["id"];
        this.diseaseDetailObj.modelId = this.tunnelOptions["struct"]["id"];
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
  }

  public dismiss(){
    this._viewCtrl.dismiss();
  }

  /**
   * 获取多媒体文件
   */
  public captureMedia(photos: MediaContent[]){
    photos.forEach(photo => this.photos.unshift(photo));
  }

  public async createDisease(){
    let loader = this.loadingController.create({
      dismissOnPageChange: true,
      duration: 500
    });
    this.diseaseDetailObj.synFlg = 1;
    this.diseaseDetailObj.photos = this.photos;
    loader.present();
    if(this.isNewRecord) {
      await this.facilityInspService.addNewFacilityInspSummary(this.diseaseDetailObj)
      localStorage.setItem("createDiseaseInfo", JSON.stringify(this.diseaseInfo));
      await this.facilityInspService.addNewFacilityInspDetail(this.diseaseDetailObj, this.diseaseDetailObj.createUser);
      this._viewCtrl.dismiss(this.diseaseDetailObj);
    }
    this._event.publish('groundDataChange');
  }
}
