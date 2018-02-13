import { SyncUploadService } from '../sync_upload/sync-upload.service';
import { SyncDownloadService } from '../sync_download/sync-download.service';
import { UndergroundModule } from './underground/underground.module';
import { GroundModule } from './ground/ground.module';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { NgModule } from '@angular/core';

import { XunjianComponent }   from './xunjian.component';
import { HuanhaoSearchComponent } from './underground/components/huanhao-search/huanhao-search.component';

@NgModule({
  imports: [
    // vendors
    FormsModule, IonicModule,
    ReactiveFormsModule, BrowserModule,
    
    // app modules
    SharedModule, GroundModule, UndergroundModule
  ],
  exports: [XunjianComponent],
  declarations: [XunjianComponent, HuanhaoSearchComponent],
  entryComponents: [
    XunjianComponent, HuanhaoSearchComponent,
  ],
  providers: [SyncDownloadService, SyncUploadService],
})
export class XunjianModule { }
