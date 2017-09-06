import { 
  Entity,
	Column,
	PrimaryColumn,
} from 'bas-typeorm';

import { IMediaContent } from './MediaContent';

@Entity('facilityDetail')
export class FacilityInspDetail { // 结构巡检明细表
	
	@Column()
	public area: number; //面积，
	
	@Column()
	public createDate: number;
	
	@Column()
	public createUser: string;
	
	@Column()
	public depth: number;
	
	@Column()
	public detailTypeId: string; //病害小类
	
	@Column()
	public diseaseNo: string;
	
	@Column()
	public diseaseDate: number; //病害日期
	
	@Column()
	public diseaseDescription: string; //病害描述
	
	@Column()
	public diseaseTypeId: string; //病害类型
	
	@Column()
	public dislocation: number; //错台量
	
	@Column()
	public monomerId: number;
	
	@Column()
	public facilityId: any;
	
	@PrimaryColumn()
	public id: any;
	
	@Column()
	public photo: string;
	
	@Column()
	public jointopen: number; //张开量
	
	@Column()
	public length: number; //长度
	
	@Column()
	public synFlg: any; //是否新建
	
	@Column()
	public recorder: string; //记录人
	
	@Column()
	public width: any; //宽度

	@Column()
	public updateDate: number;

	@Column()
	public updateUser: string;
	
	@Column({
		type: 'json'
	})
	public photos: IMediaContent[];

	constructor(obj = null) {
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

		if (!obj) {
			return;
		}

		Object.assign(this, obj);
	}
}
