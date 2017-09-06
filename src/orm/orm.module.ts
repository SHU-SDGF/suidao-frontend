import { TunnelORM } from './orm.service';
import { NgModule } from '@angular/core';
import { FacilityInspSummaryORM } from './providers/facility-insp-summary-orm.service';
import { FacilityInspDetailORM } from './providers/facility-insp-detail-orm.service';

@NgModule({
  providers: [
    TunnelORM,
    FacilityInspSummaryORM,
    FacilityInspDetailORM,
  ]
})
export class TunnelORMModule { }
