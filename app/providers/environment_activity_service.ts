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

	//根据活动名称来寻找环境活动
	searchEnvironmentActivitySummaryByActName(act_name: string) {
		let _that = this;
		let params: URLSearchParams = new URLSearchParams();
		params.set('act_name', act_name);

		return new Promise((resolve, reject) => {
			var request = _that.http.get(
        AppConfig.apiBase + '/environmentActivitySummary/',{
        	search: params
        }
      );

      request.subscribe((response)=>{
        if(response.status < 400){
          var result = response.json();
          resolve();
        }else{
          reject();
        }
      }, (error)=>{
        reject();
      });
		})
	}

	//根据ACT_NO来寻找活动历史记录
	searchEnvironmentActivitiesByActNo(act_no: string) {
		let _that = this;
		let params: URLSearchParams = new URLSearchParams();
		params.set('act_no', act_no);

		return new Promise((resolve, reject) => {
			var request = _that.http.get(
				AppConfig.apiBase + '/environmentActivities/', {
					search: params
				}
			);

			request.subscribe((response) => {
				if(response.status < 400){
          var result = response.json();
          resolve();
        }else{
          reject();
        }
			}, (error) => {
				reject();
			})
		})
	}

	//添加新的环境活动
	addNewEnvironmentActivity(activityObj: any) {

		return this.httpService.post(activityObj, 'createEnvironmentActivity');
		// let _that = this;

		// var headers = new Headers();
		// headers.append('Authorization',localStorage.getItem("authToken"));
		// return new Promise((resolve, reject) =>{
  //     var request = _that.http.post(
  //       AppConfig.apiBase + '/createEnvironmentActivity',
  //       activityObj,{
  //       	headers: headers
  //       }
  //     );
  //     request.subscribe((response)=>{
  //       if(response.status < 400){
  //         var result = response.json();
  //         resolve();
  //       }else{
  //         reject();
  //       }
  //     }, (error)=>{
  //       reject();
  //     });
  //   });
	}

	//更新已有环境活动
	updateNewEnvionrmentActivity(paramsObj: any) {
		let _that = this;

		let environmentActivityObj = {
			id: paramsObj["id"],
			act_no: paramsObj["act_no"],
			act_name: paramsObj["act_name"],
			start_date: paramsObj["start_date"],
			end_date: paramsObj["end_date"],
			description: paramsObj["description"],
			act_level: paramsObj["act_level"],
			longtitude: paramsObj["longtitude"],
			latitude: paramsObj["latitude"],
			create_user: paramsObj["create_user"],
			update_user: paramsObj["update_user"],
			insp_date: paramsObj["insp_date"],
			photo: paramsObj["photo"],
			audio: paramsObj["audio"],
			video: paramsObj["video"],
			recorder: paramsObj["recorder"]
		}

		return new Promise((resolve, reject) =>{
      var request = _that.http.post(
        AppConfig.apiBase + '/updateEnvironmentActivity',{}
      );

      request.subscribe((response)=>{
        if(response.status < 400){
          var result = response.json();
          resolve();
        }else{
          reject();
        }
      }, (error)=>{
        reject();
      });
    });
	}
}