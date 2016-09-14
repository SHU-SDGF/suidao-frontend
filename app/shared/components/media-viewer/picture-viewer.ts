import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit, EventEmitter} from '@angular/core';
import {IMediaContent, MediaContent} from '../../../models/MediaContent';
import {AppUtils} from '../../utils';
import {ImageEditor, MapOptions, MarkerOptions, Latlng} from '../../../shared/components/image-editor/image-editor';
import {MediaService} from '../../../providers/media_service';

@Component({
  template: `
    <ion-content>
      <button class="back-btn" (click)="onTap()">返回</button>
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
  pipes: [AppUtils.TimePipe],
  directives: [ImageEditor]
})
export class PictureViewerPage implements OnInit{
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
    this.url = this._mediaService.getMediaPath(this.media);
    this._mapOptions = {
      imageUrl: this.url,
      markers:[]
    };
    setTimeout(()=>{
      this.changeOptions.emit(this._mapOptions);
    });
  }

  private onTap(){
    this._viewCtrl.dismiss();
  }
}