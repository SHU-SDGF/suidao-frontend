import { MediaService } from '../../../providers/media-service';
import { NavParams, ViewController } from 'ionic-angular';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MediaContent } from '../../../../models/MediaContent';
import { MapOptions } from '../../../shared/components/image-editor/image-editor.directive';

@Component({
  template: `
    <ion-content>
      <button ion-button class="back-btn" (click)="onTap()">返回</button>
      <image-editor [changeOptions]="changeOptions" (onTap)="onTap($event)"></image-editor>
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
  ],
})
export class PictureViewerComponent implements OnInit{
  private media: MediaContent;
  private url: string;
  private _mapOptions: MapOptions;
  private changeOptions = new EventEmitter();

  constructor(
    private _viewCtrl: ViewController,
    private params: NavParams,
    private _mediaService: MediaService
    ) { 
  }

  ngOnInit(){
    this.media = this.params.get('media');
    this._mediaService.getMediaPath(this.media).then((path)=>{
      this.url = path;
      this._mapOptions = {
        imageUrl: this.url,
        markers:[]
      };
      setTimeout(()=>{
        this.changeOptions.emit(this._mapOptions);
      });
    });
  }

  public onTap(){
    this._viewCtrl.dismiss();
  }
}