import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit, EventEmitter} from '@angular/core';
import {IMediaContent} from './media-viewer';
import {AppUtils} from '../../utils';
import {ImageEditor, MapOptions, MarkerOptions, Latlng} from '../../../shared/components/image-editor/image-editor';


@Component({
  template: `
    <ion-header>
      <ion-navbar no-border-bottom>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <image-editor [changeOptions]="changeOptions"></image-editor>
    </ion-content>
  `,
  pipes: [AppUtils.TimePipe],
  directives: [ImageEditor]
})
export class PictureViewerPage implements OnInit{
  private media: IMediaContent;
  private url: string;
  private _mapOptions: MapOptions;
  private changeOptions = new EventEmitter();

  constructor(
    private _viewCtrl: ViewController,
    private params: NavParams
    ) { 
  }

  ngOnInit(){
    this.media = this.params.get('media');
    this.url = this.media.fileUri;
    this._mapOptions = {
      imageUrl: this.url,
      markers:[]
    };
    setTimeout(()=>{
      this.changeOptions.emit(this._mapOptions);
    });
  }
         
  dismiss(){
    this._viewCtrl.dismiss();
  }
}