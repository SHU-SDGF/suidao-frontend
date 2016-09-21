import {Injectable} from '@angular/core';
import { FacilityInspService } from '../../../providers/facility_insp_service';
import {FacilityInspSummary} from '../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../models/FacilityInspDetail';
import {MediaContent} from '../../../models/MediaContent';
import {AppUtils} from '../../../shared/utils';
import {MediaService, DownloadTask, UploadTaskProgress} from '../../../providers/media_service';
import * as  _ from 'lodash';

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

  constructor(
    private facilityInspService: FacilityInspService,
    private _mediaService: MediaService
  ){}

  public downloadMedias(){
  	let _self = this;
  	if(this.started) return;
    this.started = true;

    

  }
}
