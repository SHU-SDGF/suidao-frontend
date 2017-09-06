import { HttpService } from './http-service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AppMeta} from './app-meta';

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

	constructor(
		private httpService: HttpService
	) { }

	public initDB() {
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
		

		localStorage.setItem(POSITION_DESCRIPTIONS, JSON.stringify(position_descriptions));
		localStorage.setItem(ACT_TYPES, JSON.stringify(act_types_data));
		localStorage.setItem(ACTION_STATUS_DATA, JSON.stringify(act_status_data));
		localStorage.setItem(AUTHORITY_DATA, JSON.stringify(authority_data));
	}

	public getWholeLookupTable() {
		this.httpService.get({}, 'enum/whole-enum-type/list').subscribe((result) => {
			//设施小类枚举表
			let facilityTypesObj = result["facilityTypeList"].map((obj) => {
				return { id: obj.id, name: obj.facilityType }
			});
			//病害类型枚举表
			let diseaseTypesObj = result["diseaseTypeList"].map((obj) => {
				return { id: obj.id, name: obj.diseaseTypeName };
			});

			let modelNamesObj = result["modelList"].map((obj) => {
				return { id: obj.id, name: obj.modelName }
			});

			let monomersObj = result["monomer"].slice(0, 2).map((obj) => {
				return { id: obj.id, name: obj.name }
			});

			let userList = result["userList"].map((obj) => {
				return { id: obj.loginId, name: obj.userName }
			});

			localStorage.setItem(FACILITY_TYPES, JSON.stringify(facilityTypesObj));
			//单体名称枚举表
			localStorage.setItem(MONOMERS, JSON.stringify(monomersObj));
			//模型名称枚举表
			localStorage.setItem(MODELNAMES, JSON.stringify(modelNamesObj));

			//病害大类
			localStorage.setItem(DISEASE_TYPES, JSON.stringify(diseaseTypesObj));
			//病害小类枚举表
			localStorage.setItem(DETAIL_TYPES, JSON.stringify(result["diseaseTypeTreeVoList"]));

			//用户列表
			localStorage.setItem(USER_LIST, JSON.stringify(userList));
		});
	}

	//根据病害大类找小类
	getDetailTypesByDiseaseTypes(diseaseTypeId: string): Promise<any> {
		let data = localStorage.getItem(DETAIL_TYPES);
		var diseaseTypeTreeVoList = JSON.parse(data);
		var selectedDetailType = null;
		for(var index in diseaseTypeTreeVoList) {
			if(diseaseTypeTreeVoList[index]["id"] == diseaseTypeId) {
				selectedDetailType = diseaseTypeTreeVoList[index]["children"];
			}
		}
		let result = selectedDetailType.map((selectedDetail) => {
			return {id: selectedDetail.id, name: selectedDetail.diseaseTypeName}
		});
		return Promise.resolve(result);
	};

	//查询病害大类枚举表
	getDiseaseTypes(): Promise<Array<any>> {
		let data = localStorage.getItem(DISEASE_TYPES);
		return Promise.resolve(JSON.parse(data));
	};

	//查询位置描述枚举表
	getPositionDescriptions(): Promise<Array<any>> {
		let data = localStorage.getItem(POSITION_DESCRIPTIONS);
		return Promise.resolve(JSON.parse(data));
	}

	//查询模型名称枚举表
	getModelNames(): Promise<Array<any>> {
		let data = localStorage.getItem(MODELNAMES);
		return Promise.resolve(JSON.parse(data));
	}

	//查询单体名称枚举表
	getMenomers(): Promise<Array<any>> {
		let data = localStorage.getItem(MONOMERS);
		return Promise.resolve(JSON.parse(data));
	}

	//查询活动类型枚举表
	getActTypes(): Promise<Array<IOption>>{
		let data = localStorage.getItem(ACT_TYPES)
		return Promise.resolve(JSON.parse(data));
	}	

	//查询活动状态枚举表
	public getActionStatus(): Promise<Array<IActionStatus>> {
		let data = localStorage.getItem(ACTION_STATUS_DATA)
		let statusList = JSON.parse(data);
		let result = statusList.map((obj, i) => {
			obj.color = AppMeta.STATUS_CLASSES[obj.id];
			return obj;
		});
		
		return Promise.resolve(result);
	}

	//查询角色枚举表
	public getAuthorityData(): Promise<Array<any>>{
		let data = localStorage.getItem(AUTHORITY_DATA)
		return Promise.resolve(JSON.parse(data));
	}

	//根据key查询value
	public getNameBy(key, lookupTable):  Promise<string>{
		let data = localStorage.getItem(lookupTable)
		var lookupTableData = JSON.parse(data);
		var value = '';
		for(let index in lookupTableData) {
			if(lookupTableData[index]["id"] == key) {
				value = lookupTableData[index]["name"];
			}
		}
		return Promise.resolve(value);
	}

	getUserList(): Promise<Array<any>> {
		let data = localStorage.getItem("user_list");
		return Promise.resolve(JSON.parse(data));
	}

	getTunnelOption(): Promise<any> {
		let data = localStorage.getItem("tunnelOption")
		return Promise.resolve(JSON.parse(data));
	}

	getScannedInfo(): Promise<Array<any>> {
		let data = localStorage.getItem("scannedInfo");
		return Promise.resolve(JSON.parse(data));
	}

	getDiseaseInfo(): Promise<Array<any>> {
		let data = localStorage.getItem("createDiseaseInfo");
		return Promise.resolve(JSON.parse(data));
	};

	getDiseaseTypesInfo(){
		return [
			{
				"icon": 'assets/imgs/liefeng.png',
				"name": "裂缝"
			},
			{
				"icon": 'assets/imgs/shenlou.png',
				"name": "渗漏"
			},
			{
				"icon": 'assets/imgs/sunhuai.png',
				"name": "缺损"
			},
			{
				"icon": 'assets/imgs/cuotai.png',
				"name": "错台"
			},
			{
				"icon": 'assets/imgs/xichu.png',
				"name": "张开"
			},
			{
				"icon": 'assets/imgs/jiefeng.png',
				"name": "腐蚀"
			}
		];
	}
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