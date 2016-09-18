import {Component, OnInit} from '@angular/core';
import {ViewController, Events} from 'ionic-angular';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import { LookupService } from '../../../providers/lookup_service';
import * as  _ from 'lodash';
import {AppUtils, DatePipe, OptionPipe, KeysPipe} from '../../../shared/utils';

interface InspSmrGroup{
  monomerId: number;
  modelId: number;
  mileages: Array<{mileage: string, diseaseSmrList: Array<FacilityInspSummary>}>,
}

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/sync_download/sync_download.html',
  pipes: [DatePipe, OptionPipe, KeysPipe]
})
export class SyncDownloadPage implements OnInit {

  private loader = null;
  private facilityInspGroups: InspSmrGroup[] = [];
  private downloadedFacilityData = [];
  private facilityInspSummaryList = [];
  private facilityInspDetailList = [];
  private monomers = [];
  private models = [];

  constructor(
    private _viewCtrl: ViewController,
    private lookupService: LookupService,
    private facilityInspService: FacilityInspService,
    private events: Events
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

  syncDownload() {
    this.downloadFacilityRecords()
      .then(this.deleteAllFacilityInsps.bind(this))
      .then(this.saveFacilityRecordsToLocalDB.bind(this))
      .catch(function(error){
        let alert = this.alertController.create({
          title: '错误',
          subTitle: '同步数据出现错误，请重新同步数据',
          buttons: ['确认']
        });
      }.bind(this));
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  private downloadFacilityRecords() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.downloadFacilityRecords().subscribe((result) => {
        console.log('downloading successfully!');
        this.downloadedFacilityData = result;
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

  private reloadData() {
    let tunnelOption = JSON.parse(localStorage.getItem('tunnelOption'));
    this.facilityInspGroups = [];

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

  private saveFacilityRecordsToLocalDB() {
    console.log('starting save to local db');
    this.facilityInspService.saveFacilityRecordsToLocalDB(this.downloadedFacilityData).then((result) => {
      //成功！！
      this.reloadData();
      //发布事件
      this.events.publish('optionChange');
    },(error) => {
      debugger;
      console.log(error);
    })
  }
}