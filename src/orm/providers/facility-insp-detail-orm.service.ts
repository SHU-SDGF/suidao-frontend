import { FacilityInspDetail } from '../../models/FacilityInspDetail';
import { TunnelORM } from '../orm.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FacilityInspDetailORM {

  constructor(
    private _orm: TunnelORM,
  ) { }

  public addNewFacilityInspDetail(facilityInspDetailObject: FacilityInspDetail) {
    return this._orm.facilityInspDetailRepo.persist(facilityInspDetailObject);
  };

  public updateFacilityInspDetail(facilityInspDetailObject: FacilityInspDetail) {
    return this._orm.facilityInspDetailRepo.persist(facilityInspDetailObject);
  };

  //批量生成巡检明细活动
  public batchCreateFacilityInspDetails(inspDetails: FacilityInspDetail[]) {
    return this._orm.facilityInspDetailRepo.persist(inspDetails);
  };

  //批量删除巡检明细活动
  public batchDeleteFacilityInspDetails() {
    return this._orm.facilityInspDetailRepo.clear();
  }

  //根据病害号获取历史活动巡检
  public getFacilityInspDetailByDiseaseNo(diseaseNo: string) {
    return this._orm.facilityInspDetailRepo.find({
      where: { diseaseNo: diseaseNo },
      order: { createDate: 'ASC' }
    });
  }

  //获取巡检活动明细列表
  public getAllFacilityInspDetails(): Promise<FacilityInspDetail[]> {
    return this._orm.facilityInspDetailRepo.find();
  }
}
