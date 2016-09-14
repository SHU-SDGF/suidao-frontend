import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import {MediaContent} from '../../../models/MediaContent';
import {MediaService} from '../../../providers/media_service';

@Component({
  template: `
    <ion-content>
      <button class="back-btn" (click)="dismiss()">返回</button>
      <video id="my-video"
        class="video-js" 
        controls 
        preload="auto" 
        width="100%" 
        height="100%" 
        data-setup="{}"
        [src]="url">
      </video>
    </ion-content>
  `,
  /*
  template: `
    <ion-content>
      <button class="back-btn" (click)="dismiss()">返回</button>
      <iframe frameBorder="0" width="100%" height="100%" [src]="url" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
    </ion-content>
  `,
  */
  styles: [
    `
      .video-js{
        width: 100%;
        height: 100%;
      }
      .back-btn{
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 1;
        background: rgba(255,255,255,0.2);
        border: solid 1px #ccc;
        height: 4rem;
      }
    `
  ]
})
export class VideoPlayerPage implements OnInit{
  private media: MediaContent;
  private url: SafeResourceUrl;
  private mediaType: string;
  
  constructor(
    private params: NavParams,
    private _viewCtrl: ViewController,
    private _sanitizer: DomSanitizationService,
    private _mediaService: MediaService
  ) { }

  ngOnInit(){
    this.media = this.params.get('media');
    let url: string = this._mediaService.getMediaPath(this.media);
    this.url = this._sanitizer.bypassSecurityTrustUrl(url);

    this.mediaType = {
      'mp4': 'video/mp4',
      'mov': 'video/quicktime'
    }[url.substr(url.lastIndexOf('.'))];
    
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}