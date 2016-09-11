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
		//先创建巡检记录
		return this.facilityInspSummaryDB.addNewFacilityInspSummary(facilityInspobj);
	}

	// 更新巡检历史记录
	updateFacilityInsp(facilityInspObj: any) {
		return this.facilityInspSummaryDB.updateFacilityInsp(facilityInspObj);
	}

	// 新增一条巡检历史记录
	addNewFacilityInspDetail(facilityInspSummaryParam: any, createUser: string) {
		this.facilityInspDetailDB._initDB();
		let facilityDetailObj = FacilityInspDetail.deserialize(facilityInspSummaryParam);
		facilityDetailObj["_id"] = new Date().getTime().toString();
		facilityDetailObj["createDate"] = new Date().getTime();
		facilityDetailObj["updateUser"] = '';
		facilityDetailObj["updateDate"] = '';
		facilityDetailObj["createUser"] = createUser;
		facilityDetailObj["recorder"] = createUser;
		return this.facilityInspDetailDB.addNewFacilityInspDetail(facilityDetailObj);
	};

	//根据病害号获取历史活动巡检
	getFacilityInspDetailByDiseaseNo(diseaseNo: any) {
		return this.facilityInspDetailDB.getFacilityInspDetailByDiseaseNo(diseaseNo);
	};

	getFacilityInspDetailsListByAttrs(attrs) {
		let monomer = attrs["direction"]["id"];
		let model = attrs["struct"]["id"];
		let mileage = attrs["mileage"]
		return this.facilityInspSummaryDB.getFacilityInspDetailsListByAttrs(monomer, model, mileage);
	};

	getFacilityInspDetailsByAttrs(attrs) {
		let monomer = attrs["direction"]["id"];
		let model = attrs["struct"]["id"];
		return this.facilityInspSummaryDB.getFacilityInspsByAttrs(monomer, model);
	}

	getAllFacilityInspSummaries() {
		return this.facilityInspSummaryDB.getAllFacilityInspSummaries();
	}

	// 根据灾害编号来查找巡检活动
	findFacilityInspByDiseaseNo(diseaseNo: any) {
		this.facilityInspSummaryDB._initDB();
		return this.facilityInspSummaryDB.getFacilityInspByDiseaseNo(diseaseNo);
	}
}

