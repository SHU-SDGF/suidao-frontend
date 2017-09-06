import { 
  Entity,
  Column,
  PrimaryColumn,
} from 'bas-typeorm';

@Entity('activitySummary')
export class EnvironmentActivitySummary {
  
  @PrimaryColumn()
  public id: number;
  
  @Column()
  public actNo: string; //活动编码
	
  @Column()
  public actName: string; //活动名称
	
  @Column()
  public startDate: number; //起始日期
	
  @Column()
  public endDate: number; //结束日期
  
  @Column()
  public description: string; //活动描述

  // @JsonProperty('longtitude')
	
  @Column()
  public longitude: number; //经度
	
  @Column()
  public latitude: number; //纬度
	
  @Column()
  public inspDate: number; //巡检日期
	
  @Column()
  public recorder: string;
	
  @Column()
  public actStatus: any;
  
  @Column()
  public actType: any;

  constructor(obj?) {
    this.id = null;
    this.actNo = null;
    this.actName = null;
    this.startDate = null;
    this.endDate = null;
    this.description = null;
    this.longitude = null;
    this.latitude = null;
    this.inspDate = null;
    this.recorder = null;
    this.actStatus = null;
    this.actType = null;
    if (!obj) { return;}
    Object.assign(this, obj);
  }

  static deserialize: (obj)=> EnvironmentActivitySummary;
}