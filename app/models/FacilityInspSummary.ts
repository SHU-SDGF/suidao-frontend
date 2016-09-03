import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class FacilityInspSummary extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,其实就是diseaseNo
	diseaseNo: string //病害编号
	delFlg: any //删除标记
	diseaseDate: any //病害日期
	facilityType: any // 设施小类
	id: any //id
	mfacilityList: any //设施编号
	mileage: any //里程
	modelNameList: any //模型名称
	monomerNoList: any //单体名称
	photoStandard: any //标准图
	posDespList: any //位置描述
	tagId: any //标签id
	updateCnt: any //更新次数

	constructor() {
		super()
		this._id = null;
		this.id = null;
		this.diseaseNo = null;
		this.delFlg = null;
		this.diseaseDate = null;
		this.facilityType = null;
		this.mfacilityList = null;
		this.mileage = null;
		this.modelNameList = null;
		this.monomerNoList = null;
		this.photoStandard = null;
		this.posDespList = null;
		this.tagId = null;
		this.updateCnt = null;
	}

	static deserialize(obj): FacilityInspSummary {
    return null;
  }
}