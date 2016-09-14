import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import {MediaContent} from '../../../models/MediaContent';
import {MediaService} from '../../../providers/media_service';


@Component({
  template: `
    <ion-content>
      <button class="back-btn" (click)="dismiss()">返回</button>
      <iframe frameBorder="0" width="100%" height="100%" [src]="url" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
    </ion-content>
  `,
  styles: [
    `
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
  
  constructor(
    private params: NavParams,
    private _viewCtrl: ViewController,
    private _sanitizer: DomSanitizationService,
    private _mediaService: MediaService
  ) { }

  ngOnInit(){
    this.media = this.params.get('media');
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this._mediaService.getMediaPath(this.media));
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}