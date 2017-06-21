import { Directive, Input, HostListener } from '@angular/core';
import { NavController, PopoverController, Platform } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';
import { VideoPlayerComponent } from './video-player.component';
import { AudioPlayerComponent } from './audio-player.component';
import { PictureViewerComponent } from './picture-viewer.component';
import { MediaContent } from '../../../../models/MediaContent';


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
      this._navCtrl.push(PictureViewerComponent, {media: media});
    }else{
      PhotoViewer.show(media.preview, '', {share: false});
    }
  }

  playVideo(media: MediaContent){
    this._navCtrl.push(VideoPlayerComponent, {media: media});
    //VideoPlayer.play(media.localUri);
  }

  playAudio(media: MediaContent){
    this._popoverCtrl.create(AudioPlayerComponent, {media: media}).present();
  }

  constructor(private _navCtrl: NavController, private _popoverCtrl: PopoverController, private platform: Platform){}

}