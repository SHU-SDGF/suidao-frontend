import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
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

  constructor() {
    super();
    this.actName = null;
    this.actNo = null;
    this.inspDate = null;
    this.endDate = null;
    this.actStatus = null; 
    this.actType = null;
    this.description = null;
    this.photo = null;
    this.audio = null;
    this.video = null;
    this.recorder = null; 
  }

  static deserialize(obj): EnvironmentActivity {
    return null;
  }
  
}
