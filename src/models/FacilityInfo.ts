import { 
  Entity,
	Column,
	PrimaryColumn,
} from 'bas-typeorm';


@Entity('facilityInfo')
export class FacilityInfo { // 结构巡检明细表
  @Column()
  public createUser: string;

  @Column()
  public updateCnt: string;

  @Column()
  public delFlg: boolean;

  @Column()
  public createDate: number;

  @Column()
  public updateDate: number;

  @PrimaryColumn()
  public id: string;

  @Column()
  public completeDate: string;

  @Column()
  public contingencyPlan: string;

  @Column()
  public facilityImportance: string;

  @Column()
  public facilityName: string;

  @Column()
  public remark: string;

  @Column()
  public subsidyDocument: string;

  @Column()
  public supplementarySpecification: string;

  @Column()
  public technicalIndex: string;
}
