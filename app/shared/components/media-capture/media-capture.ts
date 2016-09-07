import { MediaCapture, ActionSheet, MediaFile } from 'ionic-native';
import {} from 'ionic-angular';
import {Directive, Output, EventEmitter, HostListener} from '@angular/core';
import {IMediaContent} from '../../../shared/components/media-viewer/media-viewer';

@Directive({
  selector: '[CaptureMedia]'
})
export class CaptureMedia{
  @Output() onCaptured: EventEmitter<IMediaContent> = new EventEmitter<IMediaContent>();

  constructor(){}

  @HostListener('click')
  captureMedia(){
    ActionSheet.show({
      'title': "选择媒体种类",
      "buttonLabels": ['图片', '视频', '音频']
    }).then((buttonIndex: number) => {
      if(buttonIndex == 1){
        MediaCapture.captureImage().then((medieFiles: Array<MediaFile>) => {
          this.onCaptured.emit({
            fileUri: medieFiles[0].fullPath,
            mediaType: 'img',
            preview: medieFiles[0].fullPath
          });
        });
      }else if(buttonIndex == 2){
        MediaCapture.captureVideo().then((medieFiles: Array<MediaFile>)=>{
          this.onCaptured.emit({
            fileUri: medieFiles[0].fullPath,
            mediaType: 'video',
            preview: 'build/imgs/video.png'
          });
        });
      }else if(buttonIndex == 3){
        MediaCapture.captureAudio().then((medieFiles: Array<MediaFile>)=>{
          this.onCaptured.emit({
            fileUri: medieFiles[0].fullPath,
            mediaType: 'audio',
            preview: 'build/imgs/audio.png'
          });
        });
      }
    });
  }
}
