import { SqlHelper } from '../sql-helper';
import { FacilityInfo } from '../../models/FacilityInfo';
import { TunnelORM } from '../orm.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FacilityInfoORM {

  constructor(
    private _orm: TunnelORM,
    private _sqlHelper: SqlHelper,
  ) { }

  // 批量生成环号列表
  public async batchCreateFacilityInfo(inspDetails: FacilityInfo[]) {
    
    await this._orm.facilityInfoRepo.clear();

    let columns = [
      'createUser', 'updateCnt', 'delFlg',
      'createDate', 'updateDate', 'id', 'completeDate',
      'contingencyPlan', 'facilityImportance', 'facilityName', 'remark',
      'subsidyDocument', 'supplementarySpecification', 'technicalIndex', 
    ];

    let rows = inspDetails
      .map((t) => columns.map(c=> t[c]));
    await this._sqlHelper.insertMultiRows('facilityInfo', columns, rows);
  }

  public async getInspectByIDs(ids: string[]): Promise<FacilityInfo[]> {
    return this._orm.facilityInfoRepo.findByIds(ids);
  }

  public getInspect(id: string): Promise<FacilityInfo> {
    return this._orm.facilityInfoRepo.findOne({id});
  }
}
