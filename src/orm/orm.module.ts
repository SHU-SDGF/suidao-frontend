import { SqlHelper } from './sql-helper';
import { FacilityInfoORM } from './providers/facility-info-orm.service';
import { TunnelORM } from './orm.service';
import { NgModule } from '@angular/core';
import { FacilityInspSummaryORM } from './providers/facility-insp-summary-orm.service';
import { FacilityInspDetailORM } from './providers/facility-insp-detail-orm.service';

@NgModule({
  providers: [
    TunnelORM,
    SqlHelper,
    FacilityInspSummaryORM,
    FacilityInspDetailORM,
    FacilityInfoORM,
  ]
})
export class TunnelORMModule { }
