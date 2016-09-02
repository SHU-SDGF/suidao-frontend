import {MapUtils, JsonProperty} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

export class EnvironmentActivitySummary {
  actNo: string //活动编码

  @JsonProperty('title')
	actName: string //活动名称
	startDate: any //起始日期
	endDate: any //结束日期
	description: string //活动描述
	longitude: number //经度
	latitude: number //纬度
	inspDate: any //巡检日期
	recorder: string
	actStatus: any
  actType: any

  
  static deserialize(obj: any, isAr: boolean = false): any {
    if (isAr) {
      let result = [];
      for (let o of obj) {
        result.push(this.deserialize(o)); 
      }
    } else {
      return MapUtils.deserialize(this, obj);
    }
  } 
}