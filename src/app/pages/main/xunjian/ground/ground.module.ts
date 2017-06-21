import { SearchComponent } from './components/search/search.component';
import { ActivityInfoComponent } from './components/activity-info/activity-info.component';
import { ActivityEditComponent } from './components/activity-edit/activity-edit.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { ActivityHistoryInfoComponent } from './components/activity_history_info/activity-history-info.component';
import { GroundComponent } from './ground.component';
import { SharedModule } from '../../../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    FormsModule, IonicModule,
    ReactiveFormsModule, BrowserModule, SharedModule
  ],
  exports: [GroundComponent],
  declarations: [
    GroundComponent,
    ActivityHistoryInfoComponent,
    ActivityDetailComponent,
    ActivityEditComponent, ActivityInfoComponent,
    SearchComponent
  ],
  entryComponents: [
    GroundComponent,
    ActivityHistoryInfoComponent,
    ActivityDetailComponent,
    ActivityEditComponent, ActivityInfoComponent,
    SearchComponent
  ],
  providers: [],
})
export class GroundModule {

}