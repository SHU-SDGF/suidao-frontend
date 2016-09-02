import {MapUtils, JsonProperty, IDeserialize} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

export class EnvironmentActivity extends _baseClass{
  @JsonProperty('title')
  actName: string //活动名称
  actNo: string //活动编码
	inspDate: any //巡检日期
	endDate: any //更新日时
	actStatus: any //活动状态 
	actType: any //活动类型
	description: string // 描述
	
	photo: any // 图片
	audio: any // 音频
	video: any // 视频
  recorder: string //记录人

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
