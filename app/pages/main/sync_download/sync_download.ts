import {Component, OnInit} from '@angular/core';
import {ViewController, Events} from 'ionic-angular';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import { LookupService } from '../../../providers/lookup_service';
import * as  _ from 'lodash';
import {MediaContent} from '../../../models/MediaContent';
import {AppUtils, DatePipe, OptionPipe, KeysPipe} from '../../../shared/utils';
import {MediaService, DownloadTask, DownloadTaskProgress} from '../../../providers/media_service';
import {SyncDownloadService} from './sync_download.service'; 

interface InspSmrGroup{
  monomerId: number;
  modelId: number;
  mileages: Array<InspMileage>,
}

export interface InspMileage{
  mileage: string, 
  medias: Array<MediaContent>, 
  diseaseSmrList: Array<FacilityInspSummary>,
  status?: '1' | '2' | '3' //未开始，成功，失败
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

  private taskOnProcess: DownloadTask = null;
  private tasks: any[] = [];
  private started = false;

  constructor(
    private _viewCtrl: ViewController,
    private lookupService: LookupService,
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService,
    private events: Events
  ){}

  ngOnInit() {
    Promise.all(
      [this.lookupService.getMenomers(), 
      this.lookupService.getModelNames()]).then((res: Array<any>)=>{
        this.monomers = res[0];
        this.models = res[1];
    });
  }

  syncDownload() {
    this.downloadFacilityRecords()
      .then(this.deleteAllFacilityInsps.bind(this))
      .then(this.saveFacilityRecordsToLocalDB.bind(this))
      .then(this.reloadData.bind(this))
      .then(this.downloadMedias.bind(this))
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

  private downloadMedias() {
    let _self = this;
    this.facilityInspGroups.forEach((group) => {
      group.mileages.forEach((mileage) => {
        if(mileage.medias.length > 0) {
          let mediaContentList = [];
          for(let index in mileage.medias) {
            mediaContentList.push(
              MediaContent.deserialize({
                mediaType: 'img',
                fileUri: mileage.medias[index],
                size: 0,
                preview: '',
                cached: false,
                localUri: ''
              })
            )
          }

          mileage.medias = mediaContentList;
          mileage.medias.map((media) => {
            MediaContent.deserialize({
              mediaType: 'img',
              fileUri: media,
              size: 0,
              preview: '',
              cached: false,
              localUri: ''
            });
          });
          this.tasks.push(function() {
            return new Promise((resolve, reject) => {
              _self.taskOnProcess = _self._mediaService.downloadFiles(mileage.medias);

              _self.taskOnProcess.start().subscribe((media) => {
                debugger;
              })
            })
          })
        }        
      })
    });
    console.log(this.downloadedFacilityData);
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

  private reloadData(): Promise<InspSmrGroup[]> {
    let _self = this;
    return new Promise((resolve, reject)=>{
      if(_self.started){
        resolve(_self.facilityInspGroups);
        return;
      }
      _self.facilityInspGroups = [];
      Promise.all([
          _self.facilityInspService.getAllFacilityInspDetails(), 
          _self.facilityInspService.getAllFacilityInspSummaries()])
      .then((result: Array<any>) => {

        let inspSmrList: FacilityInspSummary[] = result[1];
        let inspDetailList: FacilityInspDetail[] = result[0];
        
        inspSmrList.forEach(inspSmr=>{
          inspSmr.details = inspDetailList.filter((inspDetail)=>{
            return inspDetail.diseaseNo == inspSmr.diseaseNo;
          });
        });

        let groups = _.groupBy(inspSmrList, (inspSmr)=>{
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
            let insp = {
              mileage: mileage,
              medias: [],
              diseaseSmrList: mileages[mileage]
            };
            inspGroup.mileages.push(insp);
            inspGroup.mileages[inspGroup.mileages.length - 1].status = '1';

            mileages[mileage].forEach((disease)=>{
              disease.details.forEach((detail)=>{
                let detailPhoto = detail.photo.split(';');
                insp.medias = insp.medias.concat(detailPhoto);
              });
            });
          });

          _self.facilityInspGroups.push(inspGroup);
        });
        resolve(_self.facilityInspGroups);
      });
    });
  }
  // private reloadData(): Promise<InspSmrGroup[]> {
  //   return new Promise((resolve, reject) => {
  //     let tunnelOption = JSON.parse(localStorage.getItem('tunnelOption'));
  //     this.facilityInspGroups = [];


  //     this.facilityInspService.getAllFacilityInspSummaries().then((inspSmrList) => {
  //       let groups = _.groupBy(inspSmrList, (inspSmr)=>{
  //         return inspSmr.monomerId + '-' + inspSmr.modelId;
  //       });
  //       Object.keys(groups).map((key)=>{
  //         let inspGroup: InspSmrGroup = {
  //           modelId: ~~key.split('-')[1],
  //           monomerId: ~~key.split('-')[0],
  //           mileages:[]
  //         };

  //         let mileages = _.groupBy(groups[key], 'mileage');
  //         Object.keys(mileages).map(mileage=>{
  //           inspGroup.mileages.push({
  //             mileage: mileage,
  //             mediasList: this.fetchDiseaseMedias(mileages[mileage])
  //           });
  //         });
  //         console.log(this.downloadedFacilityData);
  //         this.facilityInspGroups.push(inspGroup);
  //         resolve(this.facilityInspGroups);
  //       })
  //     });
  //   });
  // }

  private fetchDiseaseMedias(mileages){
    let photos = [];
    let photosObj: Array<MediaContent> = [];

    for(let index in mileages){
      for(let index2 in this.downloadedFacilityData) {
        if(mileages[index]["diseaseNo"] == this.downloadedFacilityData[index2]["facilityInspSum"]["diseaseNo"]) {
           for(let index3 in this.downloadedFacilityData[index2]["facilityInspDetailList"]) {
             if(this.downloadedFacilityData[index2]["facilityInspDetailList"][index3]["photo"]) {
                photos.push(this.downloadedFacilityData[index2]["facilityInspDetailList"][index3]["photo"]);
             }
           }
        }
      }
    }

    photos.forEach((photo) => {
      photosObj.push(MediaContent.deserialize({
        mediaType: 'img',
        fileUri: photo,
        size: 0,
        preview: '',
        cached: false,
        localUri: ''
      }));
    });
   
    return photosObj;
  }

  private saveFacilityRecordsToLocalDB() {
    return new Promise((resolve, reject) => {
      console.log('starting save to local db');
      this.facilityInspService.saveFacilityRecordsToLocalDB(this.downloadedFacilityData).then((result) => {
        //成功！！
        //发布事件
        this.events.publish('optionChange');
        resolve(result);
      },(error) => {
        console.log(error);
        reject(error);
      })
    });
  }
}