import { CaptureMedia } from './components/media-capture/media-capture.directive';
import { ImageEditor } from './components/image-editor/image-editor.directive';
import { IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, OptionPipe, StatusPipe, TimePipe, TrustUrl } from './utils';
import { SuidaoMap } from './components/suidao-map/suidao-map.component';
import { StatusPicker } from './components/status-picker/status-picker.component';
import { SelectPopover, SelectPopoverList } from './components/select-popover/select-popover.directive';
import { MenuTip } from './components/menu-tip/menu-tip.directive';
import { AudioPlayerComponent } from './components/media-viewer/audio-player.component';
import { MediaViewer } from './components/media-viewer/media-viewer.directive';
import { PictureViewerComponent } from './components/media-viewer/picture-viewer.component';
import { VideoPlayerComponent } from './components/media-viewer/video-player.component';

let SHARED_FEATURE_COMPONENTS = [
  DatePipe, TimePipe, SuidaoMap, OptionPipe,
  StatusPipe,
  ImageEditor,
  StatusPicker, SelectPopover, MenuTip, AudioPlayerComponent,
  MediaViewer, PictureViewerComponent, VideoPlayerComponent,
  TrustUrl,
  CaptureMedia,
  SelectPopoverList
];

@NgModule({
  imports: [
    IonicModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [...SHARED_FEATURE_COMPONENTS],
  declarations: [...SHARED_FEATURE_COMPONENTS],
  providers: [],
  entryComponents: [PictureViewerComponent, SelectPopoverList]
})
export class SharedModule { }