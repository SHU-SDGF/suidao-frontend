import { 
  Entity,
	Column,
	PrimaryColumn,
} from 'bas-typeorm';
import { FacilityInspDetail } from './FacilityInspDetail';

@Entity('facilityDetailSummary')
export class FacilityInspSummary { // 结构巡检明细表
	
	@Column()
	public area: any;
	
	@Column()
	public createDate: any;
	
	@Column()
	public createUser: string;
	
	@Column()
	public depth: any;
	
	@Column()
	public detailTypeId: any;
	
	@Column()
	public diseaseDate: any;
	
	@Column()
	public diseaseDescription: string;
	
	@PrimaryColumn()
	public diseaseNo: string;
	
	@Column()
	public diseaseTypeId: any;
	
	@Column()
	public dislocation: number;
	
	@Column()
	public facilityId: any;
	
	@Column()
	public facilityTypeId: any;
	
	@Column()
	public jointopen: number;
	
	@Column()
	public latitude: number;
	
	@Column()
	public length: number;
	
	@Column()
	public longitude: number;
	
	@Column()
	public mileage: string;
	
	@Column()
	public modelId: number; // id, modelName
	
	@Column()
	public monomerId: number;
	
	@Column()
	public synFlg: number;
	
	@Column()
  public needRepair: any
	
	@Column()
  public recorder: string
	
	@Column()
  public width: number
	
  public details: FacilityInspDetail[]

	constructor(obj = null) {
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
		this.synFlg = null;
		this.jointopen = null;
		this.longitude = null;
		this.latitude = null;
		this.length = null;
		this.mileage = null;
		this.modelId = null; 
		this.monomerId = null;
		this.recorder = null;
		this.width = null;
		this.details = [];

		if (!obj) { return obj; }
		Object.assign(this, obj);
	}
}