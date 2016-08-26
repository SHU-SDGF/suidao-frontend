import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import { AppConfig } from './config';
import {URLSearchParams} from '@angular/http';
import {HttpService} from './http_service';

export interface EnvironmentActivity {
  act_no?: string //活动编码
	insp_date: any //巡检日期
	end_date: any //更新日时
	act_status: any //活动状态 
	act_type: any //活动类型
	description: string // 描述
	create_user?: string //作成者
	update_user?: string // 更新者
	photo: any // 图片
	audio: any // 音频
	video: any // 视频
	recorder?: string //记录人
	create_date?: any //作成日时
	update_date?: any //更新日时
}

export interface EnvironmentActivitySummary {
	act_no?: string //活动编码
	act_name: string //活动名称
	start_date?: any //起始日期
	end_date?: any //结束日期
	description: string //活动描述
	longitude: number //经度
	latitude: number //纬度
	create_user?: string //作成者
	update_user?: string //更新者
	create_date?: any //作成日时
	update_date?: any //更新日时
	recorder: string
	act_status: any
	act_type: any
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
	searchEnvironmentActivitiesByActNo(act_no: string) {
		return this.httpService.get({'act_no': act_no}, 'environment-activities/listByActNo')
	}
	//添加新的环境历史活动
	addNewEnvironmentActivity(activityObj: any) {
		return this.httpService.post(activityObj, 'environment-activities/create');
	}

	//更新已有环境活动
	updateNewEnvionrmentActivity(paramsObj: any) {
	}
}