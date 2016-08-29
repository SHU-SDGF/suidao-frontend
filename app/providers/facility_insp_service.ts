import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';

//结构巡检汇总表
export interface FacilityInspSummary {
	mileage: string,
	photoStandard?: string,
	diseaseNo: string,
	diseaseDate: any,
	monomerNo: string,
	facilityNo: string,
	facilityType: string,
	posDesp: string,
	tabId?: any,
	modelName: string,
	createUser: string,
	updateUser?: string,
	createDate?: any,
	updateDate?: any
}

//结构巡检明细表
export interface FacilityInspDetail {
	id: number,
	diseaseNo: string,
	diseaseDate: any,
	diseaseType: any,
	detailType: any,
	diseaseDescription: string,
	depth: number,
	length: number,
	width: number,
	area: number,
	jointopen: number,
	dislocation: number,
	photo: string,
	recorder: string,
	updateUser: string,
	createUser: string,
	createDate? : any,
	updateDate? : any
}

//里程病害匹配表
export interface MileageDiseaseMatch {
	matchId: string,
	Mileage: string,
	diseaseNo: string,
	locationX: number,
	locationY: number,
	createUser?: string,
	updateUser?: string
}

@Injectable()
export class FacilityInspService {

}
