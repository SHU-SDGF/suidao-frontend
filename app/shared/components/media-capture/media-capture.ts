import { MediaCapture, ActionSheet, MediaFile } from 'ionic-native';
import {Directive, Output, EventEmitter, HostListener} from '@angular/core';
import {MediaContent} from '../../../models/MediaContent';
import {FileService} from '../../../providers';
import {AlertController} from 'ionic-angular';

@Directive({
  selector: '[CaptureMedia]'
})
export class CaptureMedia{
  @Output() onCaptured: EventEmitter<MediaContent> = new EventEmitter<MediaContent>();

  constructor(private _fileService: FileService, private _alertCtrl: AlertController){}

  @HostListener('click')
  captureMedia(){
    ActionSheet.show({
      'title': "选择媒体种类",
      "buttonLabels": ['图片', '视频', '音频']
    }).then((buttonIndex: number) => {
      if(buttonIndex == 1){
        MediaCapture.captureImage().then((medieFiles: Array<MediaFile>) => {
          
          this._fileService.copyFile(medieFiles[0].fullPath).then((path)=>{
            let media = new MediaContent({
              localUri: path,
              mediaType: 'img',
              preview: path
            });
            
            this.onCaptured.emit(media);
          }, (err)=>{
            alert(JSON.stringify(err));
          });
          
        });
      }else if(buttonIndex == 2){
        MediaCapture.captureVideo().then((medieFiles: Array<MediaFile>)=>{

          this._fileService.copyFile(medieFiles[0].fullPath).then((path)=>{
            let media = new MediaContent({
              localUri: path,
              mediaType: 'video',
              preview: 'build/imgs/video.png'
            });
            
            this.onCaptured.emit(media);
          });
          
        });
      }else if(buttonIndex == 3){
        MediaCapture.captureAudio().then((medieFiles: Array<MediaFile>)=>{
          
          this._fileService.copyFile(medieFiles[0].fullPath).then((path)=>{
            let media = new MediaContent({
              localUri: path,
              mediaType: 'audio',
              preview: 'build/imgs/audio.png'
            });

            this.onCaptured.emit(media);
          });
          
        });
      }
    });
  }
}
