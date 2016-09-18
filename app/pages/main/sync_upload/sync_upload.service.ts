import {Injectable} from '@angular/core';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import {MediaContent} from '../../../models/MediaContent';
import * as  _ from 'lodash';

export interface InspSmrGroup{
  monomerId: number;
  modelId: number;
  mileages: Array<{
    mileage: string, 
    medias: Array<MediaContent>, 
    diseaseSmrList: Array<FacilityInspSummary>,
    status?: '1' | '2' | '3' //未开始，成功，失败
  }>
}


@Injectable()
export class SyncUploadService{
  private facilityInspGroups: InspSmrGroup[] = [];
  private ready = false;

  constructor(
    private facilityInspService: FacilityInspService
  ){}

  public getFacilityInspGroups(){
    return this.reloadData();
  }

  private reloadData(): Promise<InspSmrGroup[]> {
    let _self = this;
    return new Promise((resolve, reject)=>{
      if(_self.ready){
        resolve(_self.facilityInspGroups);
        return;
      }
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
        })
      });
      this.ready = true;
      resolve(_self.facilityInspGroups);
    });
  }
}