import {ViewController, NavParams, LoadingOptions, LoadingController, AlertController } from 'ionic-angular';
import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';

import {AppUtils} from '../../../../../../shared/utils';
import {LookupService} from '../../../../../../providers/lookup_service';
import {FacilityInspService} from '../../../../../../providers/facility_insp_service';
import {UserService} from '../../../../../../providers';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_save/observ_save.html',
  pipes: [AppUtils.DatePipe]
})
export class ObservSavePage implements OnInit{
  private diseaseNo = '';
  private diseaseDetailObj: any = {};
  private diseaseTypeList: [{
    name:string,
    id: string
  }];
  private point: any;
  private diseaseInfo: {
    date: string,
    count: number
  }
  private detailTypeList: any;
  private isNewRecord = true;
  constructor(private _viewCtrl: ViewController, private lookupService: LookupService, private params: NavParams, private facilityInspService: FacilityInspService, private userService: UserService, private loadingController: LoadingController, private _alertController: AlertController){

  }

  ngOnInit(){
    let diseaseNo = this.params.data.diseaseNo;
    var tunnelOptions = JSON.parse(localStorage.getItem("tunnelOption"));
    this.diseaseInfo = this.params.data.diseaseInfo;
    let scannedInfo = JSON.parse(localStorage.getItem("scannedInfo"));
    // this.mileage = this.params.data.
    this.point = this.params.data.point;
    this.diseaseTypeList = [this.params.data.diseaseType.diseaseType];
    this.isNewRecord = this.params.data.isNewRecord;
    this.facilityInspService.findFacilityInspByDiseaseNo(diseaseNo).then((result) => {
      if(result.docs > 0 ){
        this.isNewRecord = false;
      } else {
        this.diseaseDetailObj = {
          diseaseType: this.diseaseTypeList[0]["id"],
          modelNameList: {
            "id": tunnelOptions["direction"]["id"],
            "modelName": tunnelOptions["direction"]["name"]
          },
          monomerNoList: {
            "id": tunnelOptions["struct"]["id"],
          },
          recorder: '',
          createUser: '',
          createDate: new Date().getTime(),
          isNeedRepair: true,
          depth: 0,
          length: 0,
          area: 0,
          width: 0,
          jointOpen: 0,
          position: {longitude: this.point.longitude, latitude: this.point.latitude},
          diseaseNo: this.params.data.diseaseNo,
          diseaseDate: new Date().getTime(),
          diseaseDescription: '',
          displayDiseaseDate: new Date().toISOString().slice(0, 10),
          displayModelName: tunnelOptions["direction"]["name"],
          facilityType: "1",
          mfacilityList: { facilityNo: scannedInfo["mfacility"]},
          mileage: scannedInfo["mileage"]
        };

        this.detailTypeList = this.lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailObj.diseaseType);
        this.diseaseDetailObj.detailType = this.detailTypeList[0]["id"];
        this.userService.getUsername().then((username) => {
          this.diseaseDetailObj.recorder = username;
          this.diseaseDetailObj.createUser = username;
        });
      }
    }, (error) => {
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  createDisease(){
    let that = this;
    let options: LoadingOptions = {};
    let loader = this.loadingController.create({
      dismissOnPageChange: true,
      duration: 2000
    });
    loader.present();
    if(this.isNewRecord) {
      this.facilityInspService.addNewFacilityInspSummary(this.diseaseDetailObj).then((result) => {
        if(result.ok) {
          localStorage.setItem("createDiseaseInfo", JSON.stringify(this.diseaseInfo));
          this._viewCtrl.dismiss(this.diseaseDetailObj);
        }
      },(error) => {
      });
    } else {
      // this.facilityInspService.addNewFacilityInspDetail(that.diseaseDetailObj).then((result) => {
      //   if(result.ok) {
      //     this._viewCtrl.dismiss(this.diseaseDetailObj);
      //   }
      // }, (error) => {
      // });
    }
  }
}
