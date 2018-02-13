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
	public addNewEnvironmentActivitySummary(activitySummaryObj: {environmentActitivitySummary: EnvironmentActivitySummary, environmentActivity: EnvironmentActivity}) {
		return this.httpService.post({
			environmentActitivitySummary: Object.assign({}, activitySummaryObj.environmentActitivitySummary, {longtitude: activitySummaryObj.environmentActitivitySummary.longitude}) , 
			environmentActivity: activitySummaryObj.environmentActivity
		}, 'environment-activities-summary/create').toPromise();
	}

	//显示活动列表
	public getEnvironmentActivitiesSummaryList() {
		return this.httpService.get({}, 'environment-activities-summary/list').map((acts: Array<any>)=>{
			return acts.map((act) => {
				act.longitude = act.longtitude;
				return new EnvironmentActivitySummary(act);
			});
		}).toPromise();
	}

	//根据ACT_NO来寻找活动历史记录
	public searchEnvironmentActivitiesByActNo(actNo: string, pageable?: number) {
		let params = {};
		if(pageable){
			params['page'] = pageable;
		}
		return this.httpService.get(params, 'environment-activities/listByActNo/' + actNo)
			.map((result: {content: Array<any>, first: boolean, last: boolean})=>{
				return {
					environmentActivityList: result.content.map((obj)=>{
						return new EnvironmentActivity(obj);
					}),
					last: result.last,
					first: result.first
				};
			}).toPromise();
	}

	//添加新的环境历史活动
	public addNewEnvironmentActivity(activityObj: EnvironmentActivity) {
		return this.httpService.post(activityObj, 'environment-activities/create').toPromise();
	}
}
