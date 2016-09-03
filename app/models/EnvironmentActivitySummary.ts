import {MapUtils, JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class EnvironmentActivitySummary {
  actNo: string //活动编码

  @JsonProperty('title')
	actName: string //活动名称
	startDate: any //起始日期
	endDate: any //结束日期
  description: string //活动描述

  @JsonProperty('longtitude')
	longitude: number //经度
	latitude: number //纬度
	inspDate: any //巡检日期
	recorder: string
	actStatus: any
  actType: any

  constructor() {
    this.actNo = null;
    this.actName = null;
    this.startDate = null;
    this.endDate = null;
    this.description = null;
    this.longitude = null;
    this.latitude = null;
    this.inspDate = null;
    this.recorder = null;
    this.actStatus = null;
    this.actType = null;
  }

  static deserialize(obj): EnvironmentActivitySummary {
    return null;
  }
}