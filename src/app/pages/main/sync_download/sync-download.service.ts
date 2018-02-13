import { Subject } from 'ionic-native/node_modules/rxjs/Rx';
import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';
import { FacilityInspService } from '../../../providers/facility-insp-service';
import {FacilityInspDetail} from '../../../../models/FacilityInspDetail';
import {AppUtils} from '../../../shared/utils';
import {MediaService, DownloadTask, UploadTaskProgress} from '../../../providers/media-service';
import * as  _ from 'lodash';
import { MediaContent } from '../../../../models/MediaContent';
import { FacilityInspSummary } from '../../../../models/FacilityInspSummary';
import { FacilityInfoORM } from '../../../../orm/providers/facility-info-orm.service';

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
export class SyncDownloadService {
  private taskOnProcess: DownloadTask = null;
  private tasks: any[] = [];
  private started = false;

  private facilityInspGroups: InspSmrGroup[] = [];
  private downloadedFacilityData = [];
  private updatedInspDetailList = [];

  constructor(
    private facilityInspService: FacilityInspService,
    private facilityInfoORM: FacilityInfoORM,
    private _mediaService: MediaService,
    private events: Events
  ) { }

  public syncDownload() {
    if (this.started) throw (new Error('任务正在进行中'));
    
    let subject = new Subject();
    setTimeout(async () => {
      subject.next('data_started');
      try {
        let facilityList = await this.facilityInspService.downloadFacilityList();
        await this.facilityInfoORM.batchCreateFacilityInfo(facilityList);
        await this.reloadData();
        subject.next('data_ready');
        await this.downloadMedias();
        if (this.facilityInspGroups.length) {
          throw 'media_error';
        } else {
          console.log("finished");
          console.log(this.updatedInspDetailList);
          await this.facilityInspService.batchCreateFacilityInspDetails(this.updatedInspDetailList);
          console.log('finished!');
          subject.next('media_ready');
        }
      } catch (e) {
        subject.error(e);
      }
    });
    return subject;
  }

  public getFacilityInspGroups() {
    return this.facilityInspGroups;
  }

  private async reloadData() {
    try {
      this.facilityInspGroups.splice(0, this.facilityInspGroups.length);
      await this.downloadFacilityRecords();
      await this.facilityInspService.deleteAllFacilityInsps();
      await this.saveFacilityRecordsToLocalDB();
      let result = await Promise.all([
        this.facilityInspService.getAllFacilityInspDetails(),
        this.facilityInspService.getAllFacilityInspSummaries()
      ]);

      let inspSmrList: FacilityInspSummary[] = result[1];
      let inspDetailList: FacilityInspDetail[] = result[0];
            
      inspSmrList.forEach(inspSmr => {
        inspSmr.details = inspDetailList.filter((inspDetail) => {
          return inspDetail.diseaseNo == inspSmr.diseaseNo;
        });
      });

      let groups = _.groupBy(inspSmrList, (inspSmr) => {
        return inspSmr.monomerId + '-' + inspSmr.modelId;
      });
      Object.keys(groups).map((key) => {
        let inspGroup: InspSmrGroup = {
          modelId: ~~key.split('-')[1],
          monomerId: ~~key.split('-')[0],
          mileages: []
        };

        let mileages = _.groupBy(groups[key], 'mileage');

        Object.keys(mileages).map(mileage => {
          let insp = {
            mileage: mileage,
            medias: [],
            diseaseSmrList: mileages[mileage]
          };
          inspGroup.mileages.push(insp);
          inspGroup.mileages[inspGroup.mileages.length - 1].status = '1';

          mileages[mileage].forEach((disease) => {
            disease.details.forEach((detail) => {
              let detailPhoto = detail.photo ? detail.photo.split(';') : [];
              detail.photos = detailPhoto.map(uri => ({
                mediaType: 'img' as any,
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

        inspGroup.mileages = inspGroup.mileages.filter((m) => {
          return !!m.medias.length;
        });
        if (inspGroup.mileages.length) {
          this.facilityInspGroups.push(inspGroup);
        }
      });
    } catch (err) {
      throw 'data_error';
    }
  }

  private async saveFacilityRecordsToLocalDB() {
    console.log('starting save to local db');
    await this.facilityInspService.saveFacilityRecordsToLocalDB(this.downloadedFacilityData);
    this.events.publish('optionChange');
  }

  private async downloadMedias() {

    // create tasks    
    this.facilityInspGroups.forEach((group) => {
      group.mileages.forEach((mileage) => {
        if (mileage.medias.length > 0) {
          this.tasks.push(this.createTask(group, mileage));
        }
      });
    });

    // process tasks    
    try {
      for (let task of this.tasks) {
        await task();
      }
    } catch (e) {
      throw 'media_error';
    }
  }

  private createTask(group: InspSmrGroup, mileage: InspMileage) {
    return () => {
      return new Promise((resolve, reject) => {
        this.taskOnProcess = this._mediaService.downloadFiles(mileage.medias);
        this.taskOnProcess.$progress.subscribe((progress: UploadTaskProgress) => {
          mileage.status = <any>`${AppUtils.formatBytes(progress.loaded || 0, 1)}/${AppUtils.formatBytes(progress.total || 1, 1)} (${progress.fileIndex}/${progress.totalFiles})`;
        });

        this.taskOnProcess.start().subscribe((media) => {
                
          if (media) {
            //存起来
            let detail = this._findDisease(media, mileage);
            let photo = detail.photos.find(photo => photo.fileUri == media.fileUri);
            Object.assign(photo, {
              preview: media.localUri,
              localUri: media.localUri
            });

            this.updatedInspDetailList.push(detail);
          }
          if (this.taskOnProcess.successFiles.length == this.taskOnProcess.files.length) {
            if (this._mileageDone(mileage)) {
              group.mileages.splice(group.mileages.indexOf(mileage), 1);
              if (!group.mileages.length) {
                this.facilityInspGroups.splice(this.facilityInspGroups.indexOf(group), 1);
              }
            }
            resolve();
          }
        }, (err) => {
          mileage.status = '3';
          reject(err);
          console.log(err);
        });
      })
    };
  }

  private _mileageDone(mileage: InspMileage): boolean {
    return !mileage.diseaseSmrList.find((diseaseSmr) => {
      return !!diseaseSmr.details.find((detail) => {
        if (!detail.photos) return false;
        return !!detail.photos.find(meida => {
          return !meida.localUri;
        });
      });
    });
  }

  private _findDisease(media: MediaContent, mileage: InspMileage): FacilityInspDetail {
    let result = null;
    mileage.diseaseSmrList.find((diseaseSmr) => {
      let d = diseaseSmr.details.find((detail) => {
        return !!detail.photos.find((photo) => {
          return photo.fileUri == media.fileUri;
        });
      });
      d && (result = d);
      return !!d;
    });
    return result;
  }

  private async downloadFacilityRecords() {
    try {
      this.downloadedFacilityData = await this.facilityInspService.downloadFacilityRecords();
    } catch (error) {
      console.log('download failed');
      console.log(error);
      throw error;
    }
  }
}
