import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import {IMediaContent} from '../../../models/MediaContent';

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
  private media: IMediaContent;
  private url: SafeResourceUrl;
  
  constructor(
    private params: NavParams,
    private _viewCtrl: ViewController,
    private _sanitizer: DomSanitizationService){}

  ngOnInit(){
    this.media = this.params.get('media');
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.media.fileUri);
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}