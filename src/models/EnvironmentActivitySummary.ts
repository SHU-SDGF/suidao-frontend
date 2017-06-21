import { JsonProperty, Serializable } from '../app/providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class EnvironmentActivitySummary extends _baseClass{
  id: number
  actNo: string //活动编码
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

  constructor(obj = null) {
    super();
    
    this.id = null;
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

    this.assign(obj);
  }

  static deserialize: (obj)=> EnvironmentActivitySummary;
}