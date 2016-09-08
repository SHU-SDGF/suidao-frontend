import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class FacilityInspDetail extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,时间戳
	area: any //面积，
	createdDate: any
	createUser: any
	depth: any
	detailType: any //病害小类
	diseaseNo: any
	diseaseDate: any //病害日期
	diseaseDescription: string //病害描述
	diseaseType: any //病害类型
	dislocation: any //错台量
	id:any
	jointopen: any //张开量
	length: any //长度
	recorder: string //记录人
	width: any //宽度

	constructor(obj = null) {
		super()
		this._id = null;
		this.area = null;
		this.createDate = null;
		this.createUser = null;
		this.depth = null;
		this.detailType = null;
		this.diseaseDate = null;
		this.diseaseDescription = null;
		this.diseaseNo = null;
		this.diseaseType = null;
		this.dislocation = null;
		this.id = 0;
		this.jointopen = null;
		this.length = null;
		this.recorder = null;
		this.width = null;

		this.assign(obj);
	}

	static deserialize(obj): FacilityInspDetail {
    return null;
  }
}