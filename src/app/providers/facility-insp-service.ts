import { FacilityInfo } from '../../models/FacilityInfo';
import { FacilityInspDetail } from '../../models/FacilityInspDetail';
import { HttpService } from './http-service';
import { Injectable } from '@angular/core';
import { FacilityInspSummary } from '../../models/FacilityInspSummary';
import { FacilityInspDetailORM } from '../../orm/providers/facility-insp-detail-orm.service';
import { FacilityInspSummaryORM } from '../../orm/providers/facility-insp-summary-orm.service';

@Injectable()
export class FacilityInspService {
	constructor(
		public facilityInspDetailORM: FacilityInspDetailORM,
		public httpService: HttpService,
		public facilityInspSummaryORM: FacilityInspSummaryORM
	) { };

	// 新增一条巡检记录
	public addNewFacilityInspSummary(summary: FacilityInspSummary) {
		//先创建巡检记录
		return this.facilityInspSummaryORM.addNewFacilityInspSummary(summary);
	}

	// 更新巡检记录
	public updateFacilityInspSummary(summary: FacilityInspSummary) {
		return this.facilityInspSummaryORM.updateFacilityInsp(summary);
	}

	//更新巡检历史记录
	public updateFacilityInspDetail(facilityInspDetail: FacilityInspDetail) {
		return this.facilityInspDetailORM.updateFacilityInspDetail(facilityInspDetail);
	}

	// 新增一条巡检历史记录
	public addNewFacilityInspDetail(detail: FacilityInspDetail, createUser: string) {
		detail.createUser = createUser;
		detail.recorder = createUser;
		detail.createDate = new Date().getTime();
		return this.facilityInspDetailORM.addNewFacilityInspDetail(detail);
	};

	//根据病害号获取历史活动巡检
	public getFacilityInspDetailByDiseaseNo(diseaseNo: any) {
		return this.facilityInspDetailORM.getFacilityInspDetailByDiseaseNo(diseaseNo);
	};

	public getFacilityInspDetailsListByAttrs(attrs) {
		let monomer = attrs["direction"]["id"];
		let model = attrs["struct"]["id"];
		let mileage = attrs["mileage"]
		return this.facilityInspSummaryORM.getFacilityInspDetailsListByAttrs(monomer, model, mileage);
	};

	public getFacilityInspDetailsByAttrs(attrs) {
		let monomer = attrs["direction"]["id"];
		let model = attrs["struct"]["id"];
		return this.facilityInspSummaryORM.getFacilityInspsByAttrs(monomer, model);
	}

	//获取所有的巡检记录
	public getAllFacilityInspSummaries() {
		return this.facilityInspSummaryORM.getAllFacilityInspSummaries();
	}

	//获取所有的巡检历史记录
	public getAllFacilityInspDetails() {
		return this.facilityInspDetailORM.getAllFacilityInspDetails();
	}

	// 根据灾害编号来查找巡检活动
	public findFacilityInspByDiseaseNo(diseaseNo: any) {
		return this.facilityInspSummaryORM.getFacilityInspByDiseaseNo(diseaseNo);
	}

	//上传地下巡检
	public uploadFacilityRecords(facilityRecords: any) {
		return this.httpService.post(facilityRecords, 'facility-insp/upload');
	}

	//下载地下巡检
	public downloadFacilityRecords() {
		return this.httpService.get({}, 'facility-insp/download').toPromise();
	}

	public downloadFacilityList(): Promise<FacilityInfo[]> {
		return this.httpService.get({}, 'enum/facility/list').toPromise();
	}

	//将下载的数据保存到本地
	public async saveFacilityRecordsToLocalDB(facilityRecords) {
		let facilityInspSumList = [];
		let facilityInspDetailsList = [];
		for (let index in facilityRecords) {
			facilityInspSumList.push(facilityRecords[index]["facilityInspSum"]);
			facilityInspDetailsList = facilityInspDetailsList.concat(facilityRecords[index]["facilityInspDetailList"]);
		}

		for (let index in facilityInspSumList) {
			facilityInspSumList[index]["_id"] = facilityInspSumList[index]["diseaseNo"];
			facilityInspSumList[index]["synFlg"] = parseInt(facilityInspSumList[index]["synFlg"]);
			facilityInspSumList[index]["modelId"] = parseInt(facilityInspSumList[index]["modelId"]);
			facilityInspSumList[index]["monomerId"] = parseInt(facilityInspSumList[index]["monomerId"]);
		}

		for (let index in facilityInspDetailsList) {
			facilityInspDetailsList[index]["_id"] = facilityInspDetailsList[index]["diseaseDate"] + '';
			facilityInspDetailsList[index]["synFlg"] = parseInt(facilityInspDetailsList[index]["synFlg"]);
			facilityInspDetailsList[index]["modelId"] = parseInt(facilityInspDetailsList[index]["modelId"]);
			facilityInspDetailsList[index]["monomerId"] = parseInt(facilityInspDetailsList[index]["monomerId"]);
		}

		await this.facilityInspSummaryORM.batchCreateFacilityInspSummaries(facilityInspSumList);
		await this.facilityInspDetailORM.batchCreateFacilityInspDetails(facilityInspDetailsList);
	}

	//批量生成地下巡检历史记录
	public batchCreateFacilityInspDetails(facilityInspDetailsList) {
		return this.facilityInspDetailORM.batchCreateFacilityInspDetails(facilityInspDetailsList);
	}

	public async getLatestFacilityInspDetail(diseaseNo) {
		let records = await this.facilityInspDetailORM.getFacilityInspDetailByDiseaseNo(diseaseNo);
		if (!records.length) { return null; }
		return records[records.length - 1];
	}

	//删除所有的巡检记录以及所有的巡检历史记录
	public async deleteAllFacilityInsps() {
		await this.facilityInspSummaryORM.batchDeleteFacilityInspSummarise();
		await this.facilityInspDetailORM.batchDeleteFacilityInspDetails();
	}
}

