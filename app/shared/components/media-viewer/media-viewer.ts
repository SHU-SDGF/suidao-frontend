import { MediaCapture } from 'ionic-native';
import {Directive, Input, HostListener} from '@angular/core';
import { PhotoViewer, VideoPlayer} from 'ionic-native';

declare const Media: any;

export interface IMediaContent{
  mediaType: 'img' | 'video' | 'audio';
  fileUri: string,
  size?: number,
  preview?: string
}

@Directive({
  selector: '[mediaViewer]'
})
export class MediaViewer{
  @Input() mediaContent: IMediaContent;

  @HostListener('click')
  eleClicked($event){
    switch(this.mediaContent.mediaType){
      case 'img':
        this.viewImg(this.mediaContent);
        break;
      case 'video':
        this.playVideo(this.mediaContent);
        break;
      case 'audio':
        this.playAudio(this.mediaContent);
        break;
    }
  }

  viewImg(media: IMediaContent){
    PhotoViewer.show(media.fileUri, media.fileUri, {share: false});
  }

  playVideo(media: IMediaContent){
    VideoPlayer.play(media.fileUri);
  }

  playAudio(media: IMediaContent){
    let mediaPlayer = new Media(media.fileUri);
    mediaPlayer.play();
  }

  constructor(){}



}