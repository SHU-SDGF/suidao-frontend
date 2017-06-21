import { Serializable } from '../app/providers/JsonMapper';
import { MediaContent } from './MediaContent';
import { _baseClass } from './_baseClass';

@Serializable()
export class FacilityInspDetail extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,时间戳
	area: any //面积，
	createdDate: any
	createUser: any
	depth: any
	detailTypeId: any //病害小类
	diseaseNo: any
	diseaseDate: any //病害日期
	diseaseDescription: string //病害描述
	diseaseTypeId: any //病害类型
	dislocation: any //错台量
	monomerId: any
	facilityId: any
	id:any
	photo: string
	photos: MediaContent[]
	jointopen: any //张开量
	length: any //长度
	synFlg: any //是否新建
	recorder: string //记录人
	width: any //宽度
	_rev: any

	constructor(obj = null) {
		super()

		this._id = null;
		this.area = null;
		this.createDate = null;
		this.createUser = null;
		this.depth = null;
		this.detailTypeId = null;
		this.diseaseDate = null;
		this.diseaseDescription = ' ';
		this.diseaseNo = null;
		this.diseaseTypeId = null;
		this.dislocation = null;
		this.id = 0;
		this.jointopen = null;
		this.length = null;
		this.synFlg = null;
		this.recorder = null;
		this.photo = '';
		this.photos = null;
		this.monomerId = null;
		this.facilityId = null;
		this.width = null;

		this._rev = null;

		this.assign(obj);
	}

	static deserialize: (obj)=> FacilityInspDetail;
}