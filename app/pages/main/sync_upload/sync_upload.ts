import {Component, OnInit} from '@angular/core';
import {ViewController, Events, LoadingController, AlertController} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import * as  _ from 'lodash';
import { LookupService } from '../../../providers/lookup_service';
import {AppUtils, DatePipe, OptionPipe, KeysPipe} from '../../../shared/utils';

interface InspSmrGroup{
  monomerId: number;
  modelId: number;
  mileages: Array<{mileage: string, diseaseSmrList: Array<FacilityInspSummary>}>
}

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_upload/sync_upload.html',
  pipes: [DatePipe, OptionPipe, KeysPipe]
})
export class SyncUploadPage implements OnInit {

  private loader = null;
  private facilityInspGroups: InspSmrGroup[] = [];
  private monomers = [];
  private models = [];

  constructor(
    private _viewCtrl: ViewController,
    private facilityInspService: FacilityInspService,
    private events: Events,
    private loadingController: LoadingController,
    private lookupService: LookupService,
    private _alertCtrl: AlertController
  ){}

  ngOnInit() {
    Promise.all(
      [this.lookupService.getMenomers(), 
      this.lookupService.getModelNames()]).then((res: Array<any>)=>{
        this.monomers = res[0];
        this.models = res[1];
        this.reloadData();
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  syncUpload() {
    let _self = this;
    this.loader = this.loadingController.create({
      content: "数据同步中。。。",
    });
    this.loader.present();

    this.generateFacilityInspRecordList()
      .then(this.uploadFacilityRecords.bind(this))
      // .then(this.deleteAllFacilityInsps.bind(this))
      // .then(this.downloadFacilityRecords.bind(this))
      // .then(this.saveFacilityRecordsToLocalDB.bind(this))
      .catch(function(error){
        let alert = _self._alertCtrl.create({
          title: '错误',
          subTitle: '同步数据出现错误，请重新同步数据',
          buttons: ['确认']
        }).present();
      });
  }

  private reloadData() {
    let tunnelOption = JSON.parse(localStorage.getItem('tunnelOption'));

    this.facilityInspService.getAllFacilityInspSummaries().then((inspSmrList) => {
      let groups = _.groupBy(inspSmrList.filter(inspSmr=> !inspSmr.synFlg), (inspSmr)=>{
        return inspSmr.monomerId + '-' + inspSmr.modelId;
      });
      Object.keys(groups).map((key)=>{
        let inspGroup: InspSmrGroup = {
          modelId: ~~key.split('-')[1],
          monomerId: ~~key.split('-')[0],
          mileages:[]
        };

        let mileages = _.groupBy(groups[key], 'mileage');

        Object.keys(mileages).map(mileage=>{
          inspGroup.mileages.push({
            mileage: mileage,
            diseaseSmrList: mileages[mileage]
          });
        });

        this.facilityInspGroups.push(inspGroup);
      })
    });
  }

  private saveFacilityRecordsToLocalDB(result) {
    console.log('starting save to local db');
    console.log(result);
    this.facilityInspService.saveFacilityRecordsToLocalDB(result).then((result) => {
      //成功！！
      $('.loading-cmp').hide();

      //发布事件
      this.events.publish('optionChange');
      // let alert = this.alertController.create({
      //   subTitle: '数据同步成功！',
      //   buttons: ['确认']
      // });
      // alert.present();
    },(error) => {
      console.log(error);
    })
  }

  private downloadFacilityRecords() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.downloadFacilityRecords().subscribe((result) => {
        console.log('downloading successfully!');
        console.log(result);
        resolve(result);
      },(error) => {
        console.log('download failed');
        console.log(error);
        reject(error);
      });
    });

    return promise;
  }

  private deleteAllFacilityInsps() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.deleteAllFacilityInsps().then((result) => {
        console.log('delete successfully!');
        console.log(result);
        resolve();
      })
    });
    return promise;
  }

  private uploadFacilityRecords(facilityInspRecordList) {
    var promise = new Promise((resolve, reject) => {
      if(facilityInspRecordList.length != 0) {
        this.facilityInspService.uploadFacilityRecords(facilityInspRecordList).subscribe((result) => {
          console.log('uploading successfully!');
          console.log(result);
          resolve(result);
        },(error) => {
          console.log('uploading failed');
          console.log(error);
          reject(error);
        });
      } else {
        resolve({'ok': true});
      }
    });
    return promise;
  }

  private generateFacilityInspRecordList() {
    return new Promise((resolve, reject) => {
      let facilityInspList = [];
      let facilityInspDetailsList = [];
      let facilityInspRecordList = [];
      this.facilityInspService.getAllFacilityInspSummaries().then((result) => {
        facilityInspList = result;
        console.log(result);
        //同步api
        this.facilityInspService.getAllFacilityInspDetails().then((res) => {
          facilityInspDetailsList = res;
          for(let index in facilityInspList){
            let facilityInspObj = {
              "facilityInspSum": facilityInspList[index],
              "facilityInspDetailList": []
            };

            let diseaseNo = facilityInspList[index]["diseaseNo"];
            for(let index2 in facilityInspDetailsList) {
              if(diseaseNo == facilityInspDetailsList[index2]["diseaseNo"]) {
                facilityInspObj["facilityInspDetailList"].push(facilityInspDetailsList[index2]);
              }
            }
            facilityInspRecordList.push(facilityInspObj);
          }
          resolve(facilityInspRecordList);
        });
      });
    });
  }
}