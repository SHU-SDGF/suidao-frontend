import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { HttpService } from './http_service';

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
		let monomers_data = [
			{
				id: 1,
			 	text: "东线隧道",
			 	order: "1"
			},
			{
				id: 2,
			 	text: "西线隧道",
			 	order: "2"
			},
			{
				id: 3,
			 	text: "浦东工作井",
			 	order: "3"
			},
			{
				id: 4,
				text: "浦西工作井",
				order: "4"
			},
			{
				id: 5,
				text: "1#联络通道",
				order: "5"
			},
			{
				id: 6,
				text: "2#联络通道",
				order: "6"
			},
			{
				id: 7,
				text: "隧道管理大楼",
				order: "7"
			},
			{
				id: 8,
				text: "矩形段安全通道",
				order: "8"
			},
			{
				id: 9,
				text: "矩形段电缆通道",
				order: "9"
			},
			{
				id: 10,
				text: "保护区",
				order: "A"
			},
			{
				id: 11,
				text: "浦东龙门架",
				order: "B"
			},
			{
				id: 12,
				text: "浦西龙门架",
				order: "C"
			}
		];

		// 位置描述枚举表
		let position_descriptions = [
			{ id: 1, name: "环缝", order: 1},
			{ id: 2, name: "片缝", order: 2},
			{ id: 3, name: "裂缝", order: 3},
			{ id: 4, name: "注浆孔", order: 4},
			{ id: 5, name: "螺栓孔", order: 5},
			{ id: 6, name: "螺栓", order: 6}
		];

		// 模型名称枚举表
		let model_names = [
		 { id: 1, name: "紧急停靠", order: 1},
		 { id: 2, name: "小型车道", order: 2},
		 { id: 3, name: "大型车道", order: 3},
		 { id: 4, name: "消防通道", order: 4},
		 { id: 5, name: "安全通道", order: 5},
		 { id: 6, name: "电缆通道", order: 6}
		];

		// 病害类型枚举表
		let disease_types = [
			{ id: 1, names: "裂缝", order: 1},
			{ id: 2, names: "渗漏", order: 2},
			{ id: 3, names: "缺损", order: 3},
			{ id: 4, names: "错台", order: 4},
			{ id: 5, names: "张开", order: 5},
			{ id: 6, names: "腐蚀", order: 6}
		];
 		
		// 病害小类
 		let detail_types = [
			{ id: 1, name: "细微裂纹", order: 1, disease_types_order: 1},
			{ id: 2, name: "径向裂缝", order: 2, disease_types_order: 1},
			{ id: 3, name: "纵向裂缝", order: 3, disease_types_order: 1},
			{ id: 4, name: "横向裂缝", order: 4, disease_types_order: 1},
			{ id: 5, name: "竖向裂纹", order: 5, disease_types_order: 1},
			{ id: 6, name: "湿渍", order: 6, disease_types_order: 2},
			{ id: 7, name: "渗水", order: 7, disease_types_order: 2},
			{ id: 8, name: "水珠", order: 8, disease_types_order: 2},
			{ id: 9, name: "滴漏", order: 9, disease_types_order: 2},
			{ id: 10, name: "线漏", order: 10, disease_types_order: 2},
			{ id: 11, name: "漏泥沙", order: 11, disease_types_order: 2},
			{ id: 12, name: "缺角", order: 12, disease_types_order: 3},
			{ id: 13, name: "止水带损坏", order: 13, disease_types_order: 3},
			{ id: 14, name: "螺栓损坏", order: 14, disease_types_order: 3},
			{ id: 15, name: "环间错台", order: 15, disease_types_order: 4},
			{ id: 16, name: "环内错台", order: 16, disease_types_order: 4},
			{ id: 17, name: "变形缝张开", order: 17, disease_types_order: 5},	
			{ id: 18, name: "裂缝张开", order: 18, disease_types_order: 5},
			{ id: 19, name: "起壳", order: 19, disease_types_order: 6},
			{ id: 20, name: "锈斑", order: 20, disease_types_order: 6}	,
			{ id: 21, name: "泌出", order: 21, disease_types_order: 6},
			{ id: 22, name: "起皮", order: 22, disease_types_order: 6},
			{ id: 23, name: "起层", order: 23, disease_types_order: 6},
			{ id: 24, name: "蜂窝", order: 24, disease_types_order: 6},
			{ id: 25, name: "麻面", order: 25, disease_types_order: 6},
			{ id: 26, name: "松花", order: 26, disease_types_order: 6},
			{ id: 27, name: "凸起", order: 27, disease_types_order: 6},
			{ id: 28, name: "剥落", order: 28, disease_types_order: 6},
			{ id: 29, name: "凹陷", order: 29, disease_types_order: 6},
			{ id: 30, name: "掉粉", order: 30, disease_types_order: 6}
 		];

		let act_types_data = [
			{ id: 1, name: "加载", order: 1},
			{ id: 2, name: "减载", order: 2},
			{ id: 3, name: "振动", order: 3},
			{ id: 4, name: "静载", order: 4},
			{ id: 5, name: "其他", order: 5}
		];

		let act_status_data = [
			{ id: 1, name: "未开始", order: 0},
			{ id: 2, name: "进行中", order: 1},
			{ id: 3, name: "已结束", order: 2}
		];

		let authority_data = [
			{ id: 1, name: "技术人员", order: 3},
			{ id: 2, name: "中控巡检管理", order: 6},
			{ id: 3, name: "中控巡检采集", order: 7}
		]

		this.localStorage = new Storage(LocalStorage);
		// this.localStorage.set(MODELNAMES, JSON.stringify(model_names));
		this.localStorage.set(POSITION_DESCRIPTIONS, JSON.stringify(position_descriptions));
		// this.localStorage.set(MONOMERS, JSON.stringify(monomers_data));
		this.localStorage.set(ACT_TYPES, JSON.stringify(act_types_data));
		this.localStorage.set(ACTION_STATUS_DATA, JSON.stringify(act_status_data));
		this.localStorage.set(AUTHORITY_DATA, JSON.stringify(authority_data));
		// this.localStorage.set(DISEASE_TYPES, JSON.stringify(disease_types));
		//this.localStorage.set(DETAIL_TYPES, JSON.stringify(detail_types));
	}

	getWholeLookupTable() {
		this.httpService.get({}, 'enum/whole-enum-type/list').then((result) => {
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

			this.localStorage.set(FACILITY_TYPES, JSON.stringify(facilityTypesObj));
			//单体名称枚举表
			this.localStorage.set(MONOMERS, JSON.stringify(monomersObj));
			//模型名称枚举表
			this.localStorage.set(MODELNAMES, JSON.stringify(modelNamesObj));

			//病害大类
			this.localStorage.set(DISEASE_TYPES, JSON.stringify(diseaseTypesObj));
			//病害小类枚举表
			this.localStorage.set(DETAIL_TYPES, JSON.stringify(result["diseaseTypeTreeVoList"]));
		})
	}

	//根据病害大类找小类
	getDetailTypesByDiseaseTypes(diseaseTypeId: string) {
		this.localStorage.get(DETAIL_TYPES);
		var diseaseTypeTreeVoList = JSON.parse(localStorage.getItem(DETAIL_TYPES));
		var selectedDetailType = null;
		for(var index in diseaseTypeTreeVoList) {
			if(diseaseTypeTreeVoList[index]["id"] == diseaseTypeId) {
				selectedDetailType = diseaseTypeTreeVoList[index]["children"];
			}
		}
		return selectedDetailType.map(function(selectedDetail) {
			return {id: selectedDetail.id, name: selectedDetail.diseaseTypeName}
		});
	};

	//查询病害大类枚举表
	getDiseaseTypes(): any {
		return JSON.parse(localStorage.getItem(DISEASE_TYPES));
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
	getActTypes(): Promise<Array<any>>{
		return this.localStorage.get(ACT_TYPES).then((_actTypes) => {
			return JSON.parse(_actTypes);
		});
	}	

	//查询活动状态枚举表
	getActionStatus(): Promise<Array<any>>{
		return this.localStorage.get(ACTION_STATUS_DATA).then((_actStatusData) => {
			return JSON.parse(_actStatusData);
		});
	}

	//查询角色枚举表
	getAuthorityData(): Promise<Array<any>>{
		return this.localStorage.get(AUTHORITY_DATA).then((data) => {
			return JSON.parse(data);
		});
	}

	//根据key查询value
	getNameBy(key, lookupTable): string {
		var lookupTableData = JSON.parse(localStorage.getItem(lookupTable));
		var value = '';
		for(let index in lookupTableData) {
			if(lookupTableData[index]["id"] == key) {
				value = lookupTableData[index]["name"];
			}
		}
		return value
	}
}
