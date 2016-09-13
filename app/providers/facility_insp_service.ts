import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import { HttpService } from './http_service';
import { FacilityInspDetail } from '../models/FacilityInspDetail';
import { FacilityInspSummary } from '../models/FacilityInspSummary';
import { FacilityInspDetailDB } from './db/facility_insp_detail_db';
import { FacilityInspSummaryDB } from './db/facility_insp_summary_db';

@Injectable()
export class FacilityInspService {
	constructor(public facilityInspDetailDB: FacilityInspDetailDB, public httpService: HttpService, public facilityInspSummaryDB: FacilityInspSummaryDB) { };

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

	//获取所有的巡检记录
	getAllFacilityInspSummaries() {
		return this.facilityInspSummaryDB.getAllFacilityInspSummaries();
	}

	//获取所有的巡检历史记录
	getAllFacilityInspDetails() {
		return this.facilityInspDetailDB.getAllFacilityInspDetails();
	}

	// 根据灾害编号来查找巡检活动
	findFacilityInspByDiseaseNo(diseaseNo: any) {
		this.facilityInspSummaryDB._initDB();
		return this.facilityInspSummaryDB.getFacilityInspByDiseaseNo(diseaseNo);
	}

	//上传地下巡检
	uploadFacilityRecords(facilityRecords: any) {
		return this.httpService.post(facilityRecords, 'facility-insp/upload');
	}

	//下载地下巡检
	downloadFacilityRecords() {
		return this.httpService.get({}, 'facility-insp/download');
	}

	//将下载的数据保存到本地
	saveFacilityRecordsToLocalDB(facilityRecords) {
		let promise = new Promise((resolve, reject) => {
			let facilityInspSumList = [];
			let facilityInspDetailsList = [];
			for(let index in facilityRecords) {
				facilityInspSumList.push(facilityRecords[index]["facilityInspSum"]);
				facilityInspDetailsList = facilityInspDetailsList.concat(facilityRecords[index]["facilityInspDetailList"]);
			}

			for(let index in facilityInspSumList) {
				facilityInspSumList[index]["_id"] = facilityInspSumList[index]["diseaseNo"];
				facilityInspSumList[index]["synFlg"] = parseInt(facilityInspSumList[index]["synFlg"]);
				facilityInspSumList[index]["monomerId"] = parseInt(facilityInspSumList[index]["monomerId"]);
			}

			for(let index in facilityInspDetailsList) {
				facilityInspDetailsList[index]["_id"] = facilityInspDetailsList[index]["createDate"] + '';
				facilityInspDetailsList[index]["synFlg"] = parseInt(facilityInspDetailsList[index]["synFlg"]);
				facilityInspDetailsList[index]["monomerId"] = parseInt(facilityInspDetailsList[index]["monomerId"]);
			}
			this.facilityInspSummaryDB.batchCreateFacilityInspSummaries(facilityInspSumList).then((rs1) => {
				this.facilityInspDetailDB.batchCreateFacilityInspDetails(facilityInspDetailsList).then((result) => {
					debugger;
					resolve(result);
				}, (error) => {
					debugger;
				});
			}, (error) => {
				debugger;
			});
		});
		return promise;
	}

	//删除所有的巡检记录以及所有的巡检历史记录
	deleteAllFacilityInsps() {
		return new Promise((resolve, reject) => {
			this.facilityInspSummaryDB.batchDeleteFacilityInspSummarise().then((result) =>{

				this.facilityInspDetailDB.batchDeleteFacilityInspDetails().then((result) => {
					debugger;
					resolve(result);
				})
			})
		});
	}
}

