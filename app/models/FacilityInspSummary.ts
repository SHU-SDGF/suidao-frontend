import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class FacilityInspSummary extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,其实就是diseaseNo
	area: any
	createDate: any
	createUser: string
	depth: any
	detailTypeId: any
	diseaseDate: any
	diseaseDescription: string
	diseaseNo: string
	diseaseTypeId: any
	dislocation: number
	facilityId: any
	facilityTypeId: any
	jointopen: number
	latitude: number
	length: number
	longitude: number
	mileage: string
	modelId: any // id, modelName
	monomerId: any
	newCreated: any
	needRepair: any
	recorder: string
	width: number

	constructor(obj = null) {
		super()
		this._id = null;
		this.area = null;
		this.createDate = null;
		this.createUser = null;
		this.depth = null;
		this.detailTypeId = null;
		this.diseaseDate = null;
		this.diseaseNo = null;
		this.diseaseTypeId = null;
		this.dislocation = null; 
		this.facilityId = null;
		this.diseaseDescription = null;
		this.facilityTypeId = null;
		this.needRepair = null;
		this.newCreated = null;
		this.jointopen = null;
		this.longitude = null;
		this.latitude = null;
		this.length = null;
		this.mileage = null;
		this.modelId = null; 
		this.monomerId = null;
		this.recorder = null;
		this.width = null;

		this.assign(obj);
	}

	static deserialize: (obj)=> FacilityInspSummary;
}