import { 
  Entity,
  Column,
  PrimaryColumn,
} from 'bas-typeorm';

@Entity('activty')
export class EnvironmentActivity {
  	
  @PrimaryColumn()
  public id: number
  	
  @Column()
  public actName: string //活动名称
  	
  @Column()
  public actNo: string //活动编码
		
  @Column()
  public inspDate: any //巡检日期
		
  @Column()
  public endDate: any //更新日时
		
  @Column()
  public actStatus: any //活动状态 
		
  @Column()
  public actType: any //活动类型
		
  @Column()
  public description: string // 描述
	
		
  @Column()
  public photo: string // 图片
		
  @Column()
  public audio: string // 音频
		
  @Column()
  public video: string // 视频
  	
  @Column()
  public recorder: string //记录人

  constructor(obj?) {
    
    this.id = null;
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

    if (!obj) { return; }

    Object.assign(this, obj);
  }

}
