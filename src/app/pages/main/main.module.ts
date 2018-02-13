import { AnalysisComponent } from './analysis/analysis.component';
import { XunjianModule } from './xunjian/xunjian.module';
import { TestPage } from './test/test';
import { SyncUploadComponent } from './sync_upload/sync-upload.component';
import { SyncDownloadComponent } from './sync_download/sync-download.component';
import { ManyouComponent } from './manyou/manyou.component';
import { MainComponent } from './main.component';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { ConstructComponent } from '../constructing/constructing.component';
import { WeixiuComponent } from './weixiu/weixiu.component';

@NgModule({
  declarations: [
    MainComponent, ManyouComponent, SyncDownloadComponent, SyncUploadComponent,
    TestPage, ConstructComponent, AnalysisComponent, WeixiuComponent
  ],
  imports: [
    // vendor
    FormsModule, IonicModule,
    ReactiveFormsModule, BrowserModule,
    
    // app modules
    SharedModule, XunjianModule
  ],
  entryComponents: [
    MainComponent, ManyouComponent,
    SyncDownloadComponent, SyncUploadComponent,
    TestPage, ConstructComponent, AnalysisComponent, WeixiuComponent
  ],
  exports: [MainComponent],
  providers: []
})
export class MainModule {}