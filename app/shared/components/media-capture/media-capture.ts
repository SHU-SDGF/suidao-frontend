import { MediaCapture, ActionSheet, MediaFile } from 'ionic-native';
import {} from 'ionic-angular';
import {Directive, Output, EventEmitter, HostListener} from '@angular/core';
import {MediaContent} from '../../../models/MediaContent';

@Directive({
  selector: '[CaptureMedia]'
})
export class CaptureMedia{
  @Output() onCaptured: EventEmitter<MediaContent> = new EventEmitter<MediaContent>();

  constructor(){}

  @HostListener('click')
  captureMedia(){
    ActionSheet.show({
      'title': "选择媒体种类",
      "buttonLabels": ['图片', '视频', '音频']
    }).then((buttonIndex: number) => {
      if(buttonIndex == 1){
        MediaCapture.captureImage().then((medieFiles: Array<MediaFile>) => {
          let media = new MediaContent({
            localUri: medieFiles[0].fullPath,
            mediaType: 'img',
            preview: medieFiles[0].fullPath
          });
          
          this.onCaptured.emit(media);
        });
      }else if(buttonIndex == 2){
        MediaCapture.captureVideo().then((medieFiles: Array<MediaFile>)=>{

          let media = new MediaContent({
            localUri: medieFiles[0].fullPath,
            mediaType: 'video',
            preview: 'build/imgs/video.png'
          });
          
          this.onCaptured.emit(media);
        });
      }else if(buttonIndex == 3){
        MediaCapture.captureAudio().then((medieFiles: Array<MediaFile>)=>{
          
          let media = new MediaContent({
            localUri: medieFiles[0].fullPath,
            mediaType: 'audio',
            preview: 'build/imgs/audio.png'
          });

          this.onCaptured.emit(media);
        });
      }
    });
  }
}
