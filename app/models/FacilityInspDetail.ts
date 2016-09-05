import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class FacilityInspDetail extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,时间戳
	diseaseNo: string //病害编号
	area: any //面积，
	delFlg: any //删除标记
	depth: any //深度,
	detailType: any //病害小类
	diseaseDate: any //病害日期
	diseaseDescription: string //病害描述
	diseaseType: any //病害类型
	dislocation: any //错台量
	jointOpen: any //张开量
	length: any //长度
	photo: any //照片
	recorder: string //记录人
	width: any //宽度
	updateCnt: number //更新次数

	constructor() {
		super()
		this._id = null;
		this.area = null;
		this.delFlg = null;
		this.depth = null;
		this.detailType = null;
		this.diseaseDate = null;
		this.diseaseDescription = null;
		this.diseaseNo = null;
		this.diseaseType = null;
		this.dislocation = null;
		this.jointOpen = null;
		this.length = null;
		this.photo = null;
		this.recorder = null;
		this.width = null;
		this.updateCnt = null;
	}

	static deserialize(obj): FacilityInspDetail {
    return null;
  }
}