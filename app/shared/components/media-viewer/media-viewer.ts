import {Directive, Input, HostListener} from '@angular/core';
import {NavController, PopoverController, Platform} from 'ionic-angular';
import { PhotoViewer, VideoPlayer, MediaCapture, MediaPlugin} from 'ionic-native';
import {VideoPlayerPage} from './video-player';
import {AudioPlayerPage} from './audio-player';
import {PictureViewerPage} from './picture-viewer';
import {MediaContent} from '../../../models/MediaContent';

declare const Media: any;

@Directive({
  selector: '[mediaViewer]'
})
export class MediaViewer{
  @Input() mediaContent: MediaContent;

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

  viewImg(media: MediaContent){
    if(this.platform.is('ios')){
      this._navCtrl.push(PictureViewerPage, {media: media});
    }else{
      PhotoViewer.show(media.fileUri, '', {share: false});
    }
  }

  playVideo(media: MediaContent){
    this._navCtrl.push(VideoPlayerPage, {media: media});
    //VideoPlayer.play(media.fileUri);
  }

  playAudio(media: MediaContent){
    this._popoverCtrl.create(AudioPlayerPage, {media: media}).present();
  }

  constructor(private _navCtrl: NavController, private _popoverCtrl: PopoverController, private platform: Platform){}

}