import {Injectable} from '@angular/core';
import {Events, AlertController, LoadingController} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import {MediaContent} from '../../../models/MediaContent';
import {AppUtils} from '../../../shared/utils';
import {MediaService, DownloadTask, UploadTaskProgress} from '../../../providers/media_service';
import * as  _ from 'lodash';

export interface InspSmrGroup{
  monomerId: number;
  modelId: number;
  mileages: Array<InspMileage>
}

export interface InspMileage{
  mileage: string, 
  medias: Array<MediaContent>, 
  diseaseSmrList: Array<FacilityInspSummary>,
  status?: '1' | '2' | '3' //未开始，成功，失败
}


@Injectable()
export class SyncDownloadService{
  private taskOnProcess: DownloadTask = null;
  private tasks: any[] = [];
  private started = false;

  private facilityInspGroups: InspSmrGroup[] = [];
  private downloadedFacilityData = [];
  private facilityInspSummaryList = [];
  private facilityInspDetailList = [];


  constructor(
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService,
    private events: Events,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController
  ){}

  public syncDownload(): Promise<any> {
    let _self = this;
    if(this.started) throw(new Error('任务正在进行中'));

    let loader = this._loadingCtrl.create({
      content: '正在下载数据'
    });
    loader.present();
    return this.reloadData().catch(()=>{
        loader.onDidDismiss(()=>{
          _self._alertCtrl.create({
            title: '错误',
            subTitle: '同步过程中发生错误！请重新尝试！',
            buttons: ['确认']
          }).present();
        });
        loader.dismiss();
      }).then(()=>{
        loader.dismiss();
        return Promise.resolve();
      })
      .then(this.downloadMedias);
  }

  private deleteAllFacilityInsps() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.deleteAllFacilityInsps().then((result) => {
        console.log('delete successfully!');
        resolve();
      })
    });
    return promise;
  }

  public getFacilityInspGroups(){
    return this.facilityInspGroups;
  }

  private reloadData(): Promise<InspSmrGroup[]> {
    let _self = this;
    return new Promise((resolve, reject)=>{
      _self.downloadFacilityRecords()
      .then(_self.deleteAllFacilityInsps.bind(_self))
      .then(_self.saveFacilityRecordsToLocalDB.bind(_self))
      .then()
      .then(()=>{
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
    });
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

  private downloadMedias() {

    let _self = this;
  	if(this.started) return;
    this.started = true;

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
          _self.tasks.push(function() {
            return new Promise((resolve, reject) => {
              _self.taskOnProcess = _self._mediaService.downloadFiles(mileage.medias);

              _self.taskOnProcess.start().subscribe((media) => {
                let matchedInspDetail = null;
                if(media) {
                  //存起来
                  media.preview = media.localUri;
                  for(let index in mileage.diseaseSmrList) {
                    for(let index2 in mileage.diseaseSmrList[index]["details"]) {
                      let photoArray = mileage.diseaseSmrList[index]["details"][index2]["photo"].split(';');
                      let match = false;
                      for(let index3 in photoArray) {
                        if(photoArray[index3] == media.fileUri) {
                          match = true;
                        }
                      }
                      if(match) {
                      // if(mileage.diseaseSmrList[index]["details"][index2]["photo"] == media.fileUri) {
                        console.log('find-one');
                        if(mileage.diseaseSmrList[index]["details"][index2]["photos"]) {
                          mileage.diseaseSmrList[index]["details"][index2]["photos"].push(media);
                        } else {
                          mileage.diseaseSmrList[index]["details"][index2]["photos"] = [];
                          mileage.diseaseSmrList[index]["details"][index2]["photos"].push(media);
                        }
                        matchedInspDetail = mileage.diseaseSmrList[index]["details"][index2];
                      }
                    }
                  }

                  if(matchedInspDetail) {
                    console.log('update to db');
                    console.log(matchedInspDetail);
                    _self.facilityInspService.updateFacilityInspDetail(matchedInspDetail).then((result) => {
                      console.log('success');
                      console.log(result);
                    },(error) => {
                      console.log('failed');
                      console.log(error);
                    })  
                  }
                }
              })
            })
          })
        }        
      });
      AppUtils.chain(_self.tasks, true);
    });
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
}
