import { Injectable } from '@angular/core';
import { TunnelORM } from '../orm.service';
import { FacilityInspSummary } from '../../models/FacilityInspSummary';

@Injectable()
export class FacilityInspSummaryORM {

  private _facilityInspSummary: FacilityInspSummary[];

  private get _repo() {
    return this._orm.facilityInspSummaryRepo;
  }

  constructor(
    private _orm: TunnelORM,
  ) { }

  public getFacilityInspsByAttrs(monomerId, modelId) {
    return this._repo.find({ monomerId, modelId });
  }

  public getFacilityInspDetailsListByAttrs(monomerId, modelId, mileage) {
    return this._repo.find({
      monomerId,
      modelId,
      mileage,
    });
  }

  //根据巡检活动编号找到巡检活动
  public getFacilityInspByDiseaseNo(diseaseNo: string) {
    return this._repo.findOne({ diseaseNo: diseaseNo });
  }

  public updateFacilityInsp(summary: FacilityInspSummary) {
    return this._repo.persist(summary);
  }

  //生成一条巡检活动
  public addNewFacilityInspSummary(summary: FacilityInspSummary) {
  	return this._repo.persist(summary);
  }

  //批量生成巡检活动
  public batchCreateFacilityInspSummaries(summaries: FacilityInspSummary[]) {
    return this._repo.persist(summaries);
  }

  //批量删除巡检活动
  public batchDeleteFacilityInspSummarise() {
    return this._repo.clear();
  }

  public async getAllFacilityInspSummaries(): Promise<FacilityInspSummary[]> {
    this._facilityInspSummary = [];
    this._facilityInspSummary = await this._repo.find();
    return this._facilityInspSummary;
  }
}
