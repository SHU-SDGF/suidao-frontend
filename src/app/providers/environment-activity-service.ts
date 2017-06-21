import { HttpService } from './http-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { EnvironmentActivitySummary } from '../../models/EnvironmentActivitySummary';
import { EnvironmentActivity } from '../../models/EnvironmentActivity';

@Injectable()
export class EnvironmentActivityService {

	constructor(
		public httpService: HttpService, 
		public http: Http
	) {}


	//添加活动环境活动
	addNewEnvironmentActivitySummary(activitySummaryObj: {environmentActitivitySummary: EnvironmentActivitySummary, environmentActivity: EnvironmentActivity}) {
		return this.httpService.post({
			environmentActitivitySummary: activitySummaryObj.environmentActitivitySummary.serialize(), 
			environmentActivity: activitySummaryObj.environmentActivity.serialize()
		}, 'environment-activities-summary/create');
	}

	//显示活动列表
	getEnvironmentActivitiesSummaryList() {
		return this.httpService.get({}, 'environment-activities-summary/list').map((acts: Array<any>)=>{
			return acts.map(EnvironmentActivitySummary.deserialize);
		});
	}

	//根据ACT_NO来寻找活动历史记录
	searchEnvironmentActivitiesByActNo(actNo: string, pageable?: number) {
		let params = {};
		if(pageable){
			params['page'] = pageable;
		}
		return this.httpService.get(params, 'environment-activities/listByActNo/' + actNo)
			.map((result: {content: Array<any>, first: boolean, last: boolean})=>{
				return {
					environmentActivityList: result.content.map((obj)=>{
						return EnvironmentActivity.deserialize(obj);
					}),
					last: result.last,
					first: result.first
				};
			});
	}
	//添加新的环境历史活动
	addNewEnvironmentActivity(activityObj: any) {
		return this.httpService.post(activityObj, 'environment-activities/create');
	}

	//更新已有环境活动
	updateNewEnvionrmentActivity(paramsObj: any) {
	}
}