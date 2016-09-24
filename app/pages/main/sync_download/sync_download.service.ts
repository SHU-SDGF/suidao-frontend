import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import {MediaContent} from '../../../models/MediaContent';
import {AppUtils} from '../../../shared/utils';
import {MediaService, DownloadTask, UploadTaskProgress} from '../../../providers/media_service';
import {Observable, Subscriber} from 'rxjs';
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

  private updatedInspDetailList = [];


  constructor(
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService,
    private events: Events
  ){}

  public syncDownload(): Observable<any> {
    let _self = this;
    if(this.started) throw(new Error('任务正在进行中'));

    return new Observable((s: Subscriber<any>)=>{
      s.next('data_started');
      this.reloadData().catch(()=>{
        s.error('data_error');
      }).then(()=>{
        s.next('data_ready');
      })
      .then(this.downloadMedias.bind(this))
      .then(()=>{
        if(this.facilityInspGroups.length){
          s.error('media_error');
        }else{
          console.log("finished");
          console.log(this.updatedInspDetailList);

          this.facilityInspService.batchCreateFacilityInspDetails(this.updatedInspDetailList).then((result) => {
            console.log('finished!');
            console.log(result);
          }, (error) => {
            console.log(error);
            console.log('failed !');
          })
          s.next('media_ready');
        }
      }, ()=>{
        s.error('media_error');
      });
    });
   
  }

  private deleteAllFacilityInsps() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.deleteAllFacilityInsps().then((result) => {
        console.log('delete successfully!');
        console.log(this.updatedInspDetailList);
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
    this.facilityInspGroups.splice(0, this.facilityInspGroups.length);
    return new Promise((resolve, reject)=>{
      _self.downloadFacilityRecords()
      .then(_self.deleteAllFacilityInsps.bind(_self))
      .then(_self.saveFacilityRecordsToLocalDB.bind(_self))
      .then(()=>{
        return Promise.all([
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
                  detail.photos = detailPhoto.map(uri=>MediaContent.deserialize({
                     mediaType: 'img',
                    fileUri: uri,
                    size: 0,
                    preview: uri,
                    cached: false,
                    localUri: ''
                  }));
                  insp.medias = insp.medias.concat(detail.photos);
                });
              });
            });

            _self.facilityInspGroups.push(inspGroup);
          });
          resolve(_self.facilityInspGroups);
        });
      }).catch(()=>{
        reject();
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

    this.facilityInspGroups.forEach((group) => {
      group.mileages.forEach((mileage) => {
        if(mileage.medias.length > 0) {
          _self.tasks.push(function() {
            return new Promise((resolve, reject) => {
              _self.taskOnProcess = _self._mediaService.downloadFiles(mileage.medias);
              _self.taskOnProcess.$progress.subscribe((progress: UploadTaskProgress)=>{
                mileage.status = <any> `${ AppUtils.formatBytes( progress.loaded || 0, 1)}/${AppUtils.formatBytes( progress.total || 1, 1)} (${progress.fileIndex}/${progress.totalFiles})`;
              });

              _self.taskOnProcess.start().subscribe((media) => {
                
                if(media) {
                  //存起来
                  let detail = findDisease(media, mileage);
                  let photo = detail.photos.find(photo=>photo.fileUri == media.fileUri);
                  Object.assign(photo, {
                    preview: media.localUri,
                    localUri: media.localUri
                  });

                  _self.updatedInspDetailList.push(detail);
                  // let inspDetailsIndex = this.findInspDetailsIndex(detail["_id"]);
                  // console.log("find something");
                  // console.log(inspDetailsIndex);
                  // if(inspDetailsIndex === 0) {
                  //   _self.updatedInspDetailList.push(detail);
                  // } else {
                  //   _self.updatedInspDetailList[inspDetailsIndex]["photos"].concat(media);
                  // }

                  // _self.facilityInspService.updateFacilityInspDetail(detail).then((result) => {
                  //   console.log('success');
                  //   console.log(result);
                  // },(error) => {
                  //   console.log('failed');
                  //   console.log(error);
                  // }); 
                }  
                if(_self.taskOnProcess.successFiles.length == _self.taskOnProcess.files.length){
                  if(mileageDone(mileage)){
                    group.mileages.splice(group.mileages.indexOf(mileage), 1);
                    if(!group.mileages.length){
                      _self.facilityInspGroups.splice(_self.facilityInspGroups.indexOf(group), 1);
                    }
                  }
                  resolve();
                }
              }, (err)=>{
                mileage.status = '3';
                reject(err);
                console.log(err);
              });
            })
          })
        }        
      });
    });
    return AppUtils.chain(_self.tasks, true);

    function mileageDone(mileage: InspMileage):boolean{
      return !mileage.diseaseSmrList.find((diseaseSmr)=>{
        return !!diseaseSmr.details.find((detail)=>{
          if(!detail.photos) return false;
          return !!detail.photos.find(meida=>{
            return !meida.localUri;
          });
        });
      });
    }

    function findInspDetailsIndex(id) {
      let Inspindex = 0;

      if(_self.updatedInspDetailList.length === 0) {
        return Inspindex;
      } else {
        for(let index in _self.updatedInspDetailList) {
          if(_self.updatedInspDetailList[index]["_id"] === id) {
            Inspindex = parseInt(index);
          }
        }

        return Inspindex;
      }
    }

    function findDisease(media: MediaContent, mileage: InspMileage): FacilityInspDetail{
      let result = null;
      mileage.diseaseSmrList.find((diseaseSmr)=>{
        let d = diseaseSmr.details.find((detail)=>{
          return !!detail.photos.find((photo)=>{
            return photo.fileUri == media.fileUri;
          });
        });
        d && (result = d);
        return !!d;
      });
      return result;
    }
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
