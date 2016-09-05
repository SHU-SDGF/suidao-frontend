import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import {IMediaContent} from './media-viewer';

@Component({
  template: `
    <ion-header>
      <ion-navbar no-border-bottom>
        <ion-buttons start>
          <button (click)="dismiss()">
            取消
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <iframe frameBorder="0" width="100%" height="100%" [src]="url" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
    </ion-content>
  `
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