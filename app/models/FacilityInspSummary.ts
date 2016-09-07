import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class FacilityInspSummary extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,其实就是diseaseNo
	area: any
	createDate: any
	createUser: string
	depth: any
	detailType: any
	diseaseDate: any
	diseaseDiscription: string
	diseaseNo: string
	diseaseType: any
	dislocation: number
	mFacilityNo: any
	facilityType: any
	isNeedRepair: any
	isNewCreated: any
	jointopen: number
	latitude: number
	length: number
	longitude: number
	mileage: string
	modelName: any // id, modelName
	monomer: any
	recorder: string
	width: number

	constructor(obj = null) {
		super()
		this._id = null;
		this.area = null;
		this.createDate = null;
		this.createUser = null;
		this.depth = null;
		this.detailType = null;
		this.diseaseDate = null;
		this.diseaseNo = null;
		this.diseaseType = null;
		this.dislocation = null; 
		this.mFacilityNo = null;
		this.facilityType = null;
		this.isNeedRepair = null;
		this.isNewCreated = null;
		this.jointopen = null;
		this.longitude = null;
		this.latitude = null;
		this.length = null;
		this.mileage = null;
		this.modelName = null; 
		this.monomer = null;
		this.recorder = null;
		this.width = null;

		this.assign(obj);
	}

	static deserialize(obj): FacilityInspSummary {
    return null;
  }
}