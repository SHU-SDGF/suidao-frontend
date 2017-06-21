import { ObservGraphComponent } from './components/observ-graph/observ-graph.component';
import { ObservSaveComponent } from './components/observ-save/observ-save.component';
import { ObservInfoComponent } from './components/observ_info/observ-info.component';
import { DiseaseHistoryInfoComponent } from './components/disease-history-info/disease-history-info.component';
import { DiseaseInfoComponent } from './components/disease-info/disease-info.component';
import { UndergroundComponent } from './underground.component';
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
  exports: [UndergroundComponent],
  declarations: [
    UndergroundComponent,
    DiseaseInfoComponent, DiseaseHistoryInfoComponent, ObservInfoComponent, ObservSaveComponent,
    ObservGraphComponent
  ],
  entryComponents: [
    UndergroundComponent,
    DiseaseInfoComponent, DiseaseHistoryInfoComponent, ObservInfoComponent, ObservSaveComponent,
    ObservGraphComponent
  ],
  providers: [],
})
export class UndergroundModule {

}