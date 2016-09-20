import {Injectable} from '@angular/core';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import {MediaContent} from '../../../models/MediaContent';
import {AppUtils} from '../../../shared/utils';
import {MediaService, UploadTask, UploadTaskProgress} from '../../../providers/media_service';
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
export class SyncUploadService{
  private facilityInspGroups: InspSmrGroup[] = [];
  private taskOnProcess: UploadTask = null;
  private tasks: any[] = [];
  private started = false;

  constructor(
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService
  ){}

  public getFacilityInspGroups(){
    return this.reloadData();
  }

  public uploadMedias(){
    let _self = this;
    if(this.started) return;
    this.started = true;
    this.facilityInspGroups.forEach((group)=>{
      group.mileages.forEach(mileage=>{
        this.tasks.push(function(){
          return new Promise((resolve, reject)=>{
            _self.taskOnProcess = _self._mediaService.uploadFiles(mileage.medias.filter(media=>!media.fileUri));
            /**
             * file observer
             */
            _self.taskOnProcess.start().subscribe((media)=>{

              if(media){
                let diseaseDetail = findDisease(media, mileage);
                // 保存到local
                if(diseaseDetail){
                  let photo = diseaseDetail.photos.map((p)=>p.fileUri).join(';');
                  diseaseDetail.photo = photo;
                  let detail = diseaseDetail.serialize();
                  _self.facilityInspService.updateFacilityInspDetail(detail);
                }else{
                  throw(new Error('未发现病害！数据内包含错误格式数据！'));
                }
              }

              if(_self.taskOnProcess.successFiles.length == _self.taskOnProcess.files.length){
                // 若已完成全部，则上传到服务器
                if(mileageDone(mileage)){
                  _self.facilityInspService
                    .uploadFacilityRecords(_self.generateFacilityInspRecordList(mileage))
                    .subscribe(()=>{
                      mileage.diseaseSmrList.forEach(diseaseSmr=>{
                        diseaseSmr.synFlg = 0;
                        _self.facilityInspService.updateFacilityInsp(diseaseSmr);
                        diseaseSmr.details.forEach(detail=>{
                          detail.synFlg = 0;
                          let _detail = detail.serialize();
                          _self.facilityInspService.updateFacilityInspDetail(_detail);
                        });
                      })
                      group.mileages.splice(group.mileages.indexOf(mileage), 1);
                      if(!group.mileages.length){
                        _self.facilityInspGroups.splice(_self.facilityInspGroups.indexOf(group), 1);
                      }
                      resolve();
                      _self.started = false;
                    }, (err)=>{
                      mileage.status = '3';
                      console.log(err);
                      resolve(err);
                    });
                }else{
                  reject(new Error('上传未完成，但是进程停止了！'));
                }
              }
              
            }, (error)=>{
              mileage.status = '3';
            });

            /**
             * progress observer
             */
            _self.taskOnProcess.$progress.subscribe((progress: UploadTaskProgress)=>{
              mileage.status = <any> `${ AppUtils.formatBytes( progress.loaded || 0, 1)}/${AppUtils.formatBytes( progress.total || 1, 1)} (${progress.fileIndex}/${progress.totalFiles})`;
            });
          });
        });
      });
    });

    return AppUtils.chain(this.tasks, true);

    function mileageDone(mileage: InspMileage):boolean{
      return !mileage.diseaseSmrList.find((diseaseSmr)=>{
        return !!diseaseSmr.details.find((detail)=>{
          return !!detail.photos.find(meida=>{
            return !meida.fileUri;
          });
        });
      });
    }

    function findDisease(media: MediaContent, mileage: InspMileage): FacilityInspDetail{
      let result = null;
      mileage.diseaseSmrList.find((diseaseSmr)=>{
        let d = diseaseSmr.details.find((detail)=>{
          return !!detail.photos.find((photo)=>{
            return photo.localUri == media.localUri;
          });
        });
        d && (result = d);
        return !!d;
      });
      return result;
    }
  }

  private generateFacilityInspRecordList(inspMileage: InspMileage) {
    let facilityInspList = inspMileage.diseaseSmrList;
    let facilityInspDetailsList = [];
    let facilityInspRecordList = [];
    facilityInspList.forEach(inspSmr=>{
      facilityInspDetailsList = facilityInspDetailsList.concat(inspSmr.details);
      let facilityInspObj = {
        "facilityInspSum": inspSmr.serialize(),
        "facilityInspDetailList": inspSmr.details.map(detail=>detail.serialize())
      };

      facilityInspRecordList.push(facilityInspObj);
    });

    return facilityInspRecordList;
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
        inspSmrList = inspSmrList.filter(smr=>smr.synFlg);
        inspDetailList = inspDetailList.filter(detail=>detail.synFlg);
        inspSmrList.forEach(inspSmr=>{
          inspSmr.details = inspDetailList.filter((inspDetail)=>{
            return inspDetail.diseaseNo == inspSmr.diseaseNo;
          });
        });

        let groups = _.groupBy(inspSmrList.filter(inspSmr=> inspSmr.synFlg), (inspSmr)=>{
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
                insp.medias = insp.medias.concat(detail.photos);
              });
            });
          });

          _self.facilityInspGroups.push(inspGroup);
        });
        resolve(_self.facilityInspGroups);
      });
    });
  }
}