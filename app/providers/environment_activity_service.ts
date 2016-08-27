import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import { AppConfig } from './config';
import {URLSearchParams} from '@angular/http';
import {HttpService} from './http_service';

export interface EnvironmentActivity {
	actName?: string //活动名称
  actNo?: string //活动编码
	inspDate: any //巡检日期
	endDate: any //更新日时
	actStatus: any //活动状态 
	actType?: any //活动类型
	description: string // 描述
	createUser?: string //作成者
	updateUser?: string // 更新者
	photo: any // 图片
	audio: any // 音频
	video: any // 视频
	recorder?: string //记录人
	createDate?: any //作成日时
	updateDate?: any //更新日时
}

export interface EnvironmentActivitySummary {
	actNo?: string //活动编码
	actName: string //活动名称
	startDate?: any //起始日期
	endDate?: any //结束日期
	description: string //活动描述
	longitude?: number //经度
	latitude?: number //纬度
	createUser?: string //作成者
	updateUser?: string //更新者
	createDate?: any //作成日时
	updateDate?: any //更新日时,
	inspDate?: any //巡检日期
	recorder?: string
	actStatus: any
	actType?: any
}

@Injectable()
export class EnvironmentActivityService {
	constructor(public httpService: HttpService, public http: Http) {}

	storage = new Storage(LocalStorage);

	//添加活动环境活动
	addNewEnvironmentActivitySummary(activitySummaryObj: any) {
		return this.httpService.post(activitySummaryObj, 'environment-activities-summary/create');
	}

	//根据活动名称来寻找环境活动
	searchEnvironmentActivitySummaryByActName(act_name: string) {
	}

	//显示活动列表
	getEnvironmentActivitiesSummaryList() {
		return this.httpService.get({}, 'environment-activities-summary/list');
	}

	//根据ACT_NO来寻找活动历史记录
	searchEnvironmentActivitiesByActNo(actNo: string) {
		return this.httpService.get({}, 'environment-activities/listByActNo/' + actNo)
	}
	//添加新的环境历史活动
	addNewEnvironmentActivity(activityObj: any) {
		return this.httpService.post(activityObj, 'environment-activities/create');
	}

	//更新已有环境活动
	updateNewEnvionrmentActivity(paramsObj: any) {
	}
}