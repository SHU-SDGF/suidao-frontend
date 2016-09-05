import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import { FacilityInspDetail } from '../models/FacilityInspDetail';
import { FacilityInspSummary } from '../models/FacilityInspSummary';
import { FacilityInspDetailDB } from './db/facility_insp_detail_db';
import { FacilityInspSummaryDB } from './db/facility_insp_summary_db';

@Injectable()
export class FacilityInspService {
	constructor(public facilityInspDetailDB: FacilityInspDetailDB, public facilityInspSummaryDB: FacilityInspSummaryDB) { };

	// 新增一条巡检记录
	addNewFacilityInspSummary(facilityInspSummaryParam: any) {
		facilityInspSummaryParam._id = facilityInspSummaryParam.diseaseNo;
		this.facilityInspSummaryDB._initDB();
		let facilityInspobj = FacilityInspSummary.deserialize(facilityInspSummaryParam);
		let facilityDetailObj = FacilityInspDetail.deserialize(facilityInspSummaryParam);
		//先创建巡检记录 再创建巡检活动记录
		this.facilityInspSummaryDB.addNewFacilityInspSummary(facilityInspobj).then((result) => {
			this.facilityInspDetailDB.addNewFacilityInspDetail(facilityDetailObj).then((result) => {
				return result;
			});
		}, (error) => {
			return error;
		});
	}

	//批量新增巡检记录
	batchCreateFacilityInspSummary(facilityInspSummaryParams: any) {
		
	}
}

