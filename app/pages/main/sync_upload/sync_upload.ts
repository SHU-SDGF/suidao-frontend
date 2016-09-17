import {Component, OnInit} from '@angular/core';
import {ViewController, Events, LoadingController} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import * as  _ from 'lodash';
import { LookupService } from '../../../providers/lookup_service';

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_upload/sync_upload.html'
})
export class SyncUploadPage implements OnInit {

  private loader = null;
  private facilityInspList = [];
  private monomers = [];
  private models = [];

  constructor(
    private _viewCtrl: ViewController,
    private facilityInspService: FacilityInspService,
    private events: Events,
    private loadingController: LoadingController,
    private lookupService: LookupService
  ){}

  ngOnInit() {
    this.lookupService.getMenomers().then((res1) => {
      this.monomers = res1;
      this.lookupService.getModelNames().then((res2) => {
        this.models = res2;
        this.reloadData();
      })
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  syncUpload() {
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
        let alert = this.alertController.create({
          title: '错误',
          subTitle: '同步数据出现错误，请重新同步数据',
          buttons: ['确认']
        });
      }.bind(this));
  }

  private reloadData() {
    let tunnelOption = JSON.parse(localStorage.getItem('tunnelOption'));

    this.facilityInspService.getAllFacilityInspSummaries().then((result) => {
      let that = this;
      result.map((result) => {
        result.groupName = that.getMonomerNameByID(result.monomerId) + '-' + that.getModelNameByID(result.modelId);
      });

      var filteredResults = _.groupBy(result, 'groupName');
      console.log(filteredResults);
      for(var index in filteredResults) {
        this.facilityInspList.push({
          'groupName': index,
          'info': filteredResults[index]
        })
      }
    });
  }

  private getMonomerNameByID(id) {
    var name = '';
    var idString = id + '';
    for(let index in this.monomers) {
      if(this.monomers[index]["id"] == idString) {
        name = this.monomers[index]["name"];
      }
    }

    return name;
  }

  private getModelNameByID(id) {
    var idString = id + '';
    var name = '';
    for(let index in this.models) {
      if(this.models[index]["id"] == idString) {
        name = this.models[index]["name"];
      }
    }

    return name;
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