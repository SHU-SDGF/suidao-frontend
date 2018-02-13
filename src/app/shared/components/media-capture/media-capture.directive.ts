import { ImagePickerOptions } from 'ionic-native/dist/es5';
import { ImagePicker } from '@ionic-native/image-picker';
import { CaptureAudioOptions } from 'ionic-native/dist/esm';
import { FileService } from '../../../providers/file-service';
import { MediaCapture, ActionSheet, MediaFile } from 'ionic-native';
import {Directive, Output, Input, EventEmitter, HostListener} from '@angular/core';
import { MediaContent } from '../../../../models/MediaContent';
import { AlertController, Platform } from 'ionic-angular';

@Directive({
  selector: '[CaptureMedia]'
})
export class CaptureMedia{
  @Output() onCaptured: EventEmitter<MediaContent[]> = new EventEmitter<MediaContent[]>();
  @Input() imgOnly: boolean = false;

  constructor(
    private _fileService: FileService,
    private _alertCtrl: AlertController,
    private _imagePicker: ImagePicker,
    private _platform: Platform,
  ) { }

  @HostListener('click')
  captureMedia(){
    if(this.imgOnly){
      this.captureImage();
      return;
    }
    ActionSheet.show({
      title: "选择媒体种类",
      buttonLabels: ['图片', '视频', '音频'],
      addCancelButtonWithLabel: '取消',
    }).then((buttonIndex: number) => {
      if (buttonIndex == 1) {
        ActionSheet.show({
          buttonLabels: ['拍照', '从相册选择'],
          addCancelButtonWithLabel: '取消',
        }).then(async (buttonIndex: number) => {
          if (buttonIndex === 1) {
            this.captureImage();
          } else if (buttonIndex === 2) {
            let imagePickerOpts: ImagePickerOptions = {};
            let result: any[];
            if (this._platform.is('android')) {
              result = await this._imagePicker.requestReadPermission().then(async () => {
                return await this._imagePicker.getPictures(imagePickerOpts);
              });
            } else {
              result = await this._imagePicker.getPictures(imagePickerOpts);
            }
            let medias: MediaContent[] = [];

            for (let path of result) {
              let r = await this._fileService
                .copyFile(path)
                .then((newPath) => {
                  console.log(newPath);
                  let media = new MediaContent({
                    localUri: newPath,
                    mediaType: 'img',
                    preview: newPath
                  });
                
                  return media;
                }, (err) => {
                  alert(JSON.stringify(err));
                  return;
                });
              r && medias.push(r);
            }

            this.onCaptured.emit(medias);
          }
        });
      } else if (buttonIndex == 2) {
        this.captureVideo();
      } else if (buttonIndex == 3) {
        this.captureAudio();
      }
    });
  }

  captureImage(){
    MediaCapture.captureImage().then((medieFiles: Array<MediaFile>) => {
      this._fileService.copyFile(medieFiles[0].fullPath).then((path)=>{
        let media = new MediaContent({
          localUri: path,
          mediaType: 'img',
          preview: path
        });
        
        this.onCaptured.emit([media]);
      }, (err)=>{
        alert(JSON.stringify(err));
      });
      
    });
  }

  selectImage() {
    
  }

  captureVideo(){
    MediaCapture.captureVideo().then((medieFiles: Array<MediaFile>)=>{
      this._fileService.copyFile(medieFiles[0].fullPath).then((path)=>{
        let media = new MediaContent({
          localUri: path,
          mediaType: 'video',
          preview: 'assets/imgs/video.png'
        });
        this.onCaptured.emit([media]);
      });
    });
  }

  selectVideo() {
    
  }

  async captureAudio() {
    const audioOpt: CaptureAudioOptions = {
      duration: 120
    };

    let medieFiles = await MediaCapture.captureAudio(audioOpt);
    if (!(medieFiles instanceof Array)) return;
    let path = await this._fileService.copyFile(medieFiles[0].fullPath);
    let media = new MediaContent({
      localUri: path,
      mediaType: 'audio',
      preview: 'assets/imgs/audio.png'
    });
    this.onCaptured.emit([media]);
  }

  selectAudio() {
    
  }
}
