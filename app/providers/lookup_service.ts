import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { HttpService } from './http_service';
import {AppMeta} from './app_meta';

let PouchDB = require('pouchdb');

const MONOMERS = 'monomers';
const ACT_TYPES = 'act_types';
const ACTION_STATUS_DATA = 'act_status_data';
const AUTHORITY_DATA = 'authority_data';
const MODELNAMES = "model_names";
const POSITION_DESCRIPTIONS = "position_descriptions";
const DISEASE_TYPES = "disease_types";
const DETAIL_TYPES = "detail_types";
const FACILITY_TYPES = "facility_types";
const USER_LIST = "user_list";
/*
  Generated class for the LookupService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LookupService {

  constructor(private http: Http, private httpService: HttpService) {}

  private localStorage: Storage;

	initDB() {
		// 单体枚举表

		// 位置描述枚举表
		let position_descriptions = [
			{ id: 1, name: "环缝", order: '1'},
			{ id: 2, name: "片缝", order: '2'},
			{ id: 3, name: "裂缝", order: '3'},
			{ id: 4, name: "注浆孔", order: '4'},
			{ id: 5, name: "螺栓孔", order: '5'},
			{ id: 6, name: "螺栓", order: '6'}
		];

		let act_types_data = [
			{ id: 1, name: "加载", order: '1'},
			{ id: 2, name: "减载", order: '2'},
			{ id: 3, name: "振动", order: '3'},
			{ id: 4, name: "静载", order: '4'},
			{ id: 5, name: "其他", order: '5'}
		];

		let act_status_data = [
			{ id: 1, name: "未开始", order: '0'},
			{ id: 2, name: "进行中", order: '1'},
			{ id: 3, name: "已结束", order: '2'}
		];

		let authority_data = [
			{ id: 1, name: "技术人员", order: '3'},
			{ id: 2, name: "中控巡检管理", order: '6'},
			{ id: 3, name: "中控巡检采集", order: '7'}
		]

		this.localStorage = new Storage(LocalStorage);
		this.localStorage.set(POSITION_DESCRIPTIONS, JSON.stringify(position_descriptions));
		this.localStorage.set(ACT_TYPES, JSON.stringify(act_types_data));
		this.localStorage.set(ACTION_STATUS_DATA, JSON.stringify(act_status_data));
		this.localStorage.set(AUTHORITY_DATA, JSON.stringify(authority_data));
	}

	getWholeLookupTable() {
		this.httpService.get({}, 'enum/whole-enum-type/list').subscribe((result) => {
			//设施小类枚举表
			let facilityTypesObj = result["facilityTypeList"].map((obj) => {
				return { id: obj.id, name: obj.facilityType}
			});
			//病害类型枚举表
			let diseaseTypesObj = result["diseaseTypeList"].map((obj) => {
				return { id: obj.id, name: obj.diseaseTypeName};
			});

			let modelNamesObj = result["modelList"].map((obj) => {
				return { id: obj.id, name: obj.modelName}
			});

			let monomersObj = result["monomer"].slice(0,2).map((obj) => {
				return { id: obj.id, name: obj.name}
			});

			let userList = result["userList"].map((obj) => {
				return { id: obj.loginId, name: obj.userName }
			});

			this.localStorage.set(FACILITY_TYPES, JSON.stringify(facilityTypesObj));
			//单体名称枚举表
			this.localStorage.set(MONOMERS, JSON.stringify(monomersObj));
			//模型名称枚举表
			this.localStorage.set(MODELNAMES, JSON.stringify(modelNamesObj));

			//病害大类
			this.localStorage.set(DISEASE_TYPES, JSON.stringify(diseaseTypesObj));
			//病害小类枚举表
			this.localStorage.set(DETAIL_TYPES, JSON.stringify(result["diseaseTypeTreeVoList"]));

			//用户列表
			this.localStorage.set(USER_LIST, JSON.stringify(userList));
		})
	}

	//根据病害大类找小类
	getDetailTypesByDiseaseTypes(diseaseTypeId: string): Promise<any> {
		this.localStorage.get(DETAIL_TYPES);

		return this.localStorage.get(DETAIL_TYPES).then((data) => {
			var diseaseTypeTreeVoList = JSON.parse(data);
			var selectedDetailType = null;
			for(var index in diseaseTypeTreeVoList) {
				if(diseaseTypeTreeVoList[index]["id"] == diseaseTypeId) {
					selectedDetailType = diseaseTypeTreeVoList[index]["children"];
				}
			}
			return selectedDetailType.map(function(selectedDetail) {
				return {id: selectedDetail.id, name: selectedDetail.diseaseTypeName}
			});
		});		
	};

	//查询病害大类枚举表
	getDiseaseTypes(): Promise<Array<any>> {
		return this.localStorage.get(DISEASE_TYPES).then((data) => {
			return JSON.parse(data);
		})
	};

	//查询位置描述枚举表
	getPositionDescriptions(): Promise<Array<any>> {
		return this.localStorage.get(POSITION_DESCRIPTIONS).then((_positionDescriptions) => {
			return JSON.parse(_positionDescriptions);
		})
	}

	//查询模型名称枚举表
	getModelNames(): Promise<Array<any>> {
		return this.localStorage.get(MODELNAMES).then((_modelNames) => {
			return JSON.parse(_modelNames);
		})
	}

	//查询单体名称枚举表
	getMenomers(): Promise<Array<any>> {
		return this.localStorage.get(MONOMERS).then((_monomers) => {
			return JSON.parse(_monomers);
		});
	}

	//查询活动类型枚举表
	getActTypes(): Promise<Array<IOption>>{
		return this.localStorage.get(ACT_TYPES).then((_actTypes) => {
			return JSON.parse(_actTypes);
		});
	}	

	//查询活动状态枚举表
	getActionStatus(): Promise<Array<IActionStatus>>{
		return this.localStorage.get(ACTION_STATUS_DATA).then((_actStatusData) => {
			let statusList = JSON.parse(_actStatusData);
			return statusList.map((obj, i)=>{
        obj.color = AppMeta.STATUS_CLASSES[obj.id];
        return obj;
      });
		});
	}

	//查询角色枚举表
	getAuthorityData(): Promise<Array<any>>{
		return this.localStorage.get(AUTHORITY_DATA).then((data) => {
			return JSON.parse(data);
		});
	}

	//根据key查询value
	getNameBy(key, lookupTable):  Promise<String>{
		return this.localStorage.get(lookupTable).then((data) => {
			var lookupTableData = JSON.parse(data);
			var value = '';
			for(let index in lookupTableData) {
				if(lookupTableData[index]["id"] == key) {
					value = lookupTableData[index]["name"];
				}
			}
			return value;
		})		
	}

	getUserList(): Promise<Array<any>> {
		return this.localStorage.get("user_list").then((data) => {
			return JSON.parse(data);
		});
	}

	getTunnelOption(): Promise<Array<any>> {
		return this.localStorage.get("tunnelOption").then((data) => {
			return JSON.parse(data);
		})
	}

	getScannedInfo(): Promise<Array<any>> {
		return this.localStorage.get("scannedInfo").then((data) => {
			return JSON.parse(data);
		})
	}

	getDiseaseInfo(): Promise<Array<any>> {
		return this.localStorage.get("createDiseaseInfo").then((data) => {
			return JSON.parse(data);
		})
	};
}


export interface IActionStatus{
	name: string,
	id: number, 
	color: string,
	order: number
}
export interface IOption{
	id: number,
	name: string,
	order: number
}