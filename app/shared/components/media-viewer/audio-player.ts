import {NavParams, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {IMediaContent} from './media-viewer';
import {AppUtils} from '../../utils';

@Component({
  template: `
        <ion-item>
          <ion-range [(ngModel)]="playProgress" min="0" max="100" step="0.1" (ionChange)="dragTo(playProgress)">
            <ion-icon range-left name="{{icon}}" (click)="togglePlay()"></ion-icon>
          </ion-range>
          <div><span>{{stream.currentTime | TimePipe}} / {{stream.duration | TimePipe}}</span></div>
        </ion-item>
  `,
  pipes: [AppUtils.TimePipe]
})
export class AudioPlayerPage implements OnInit{
  private playProgress: number = 0;
  private playing: boolean = false;
  private stream: HTMLAudioElement;
  private media: IMediaContent;
  private url: string;
  private icon: string = 'ios-play';

  constructor(
    private _viewCtrl: ViewController,
    private params: NavParams
    ) { 
  }

  ngOnInit(){
    this.media = this.params.get('media');
    this.url = this.media.fileUri;
    this.stream = new Audio(this.url);
    this.stream.addEventListener("timeupdate", this.updateProgress.bind(this), false);
  }

  togglePlay(){
    if(this.playing){
      this.pause();
    }else{
      this.play();
    }
  }

  play() {
    this.playing = true;
    this.icon = 'ios-pause';
    this.stream.play();
  };

  pause() {
    this.icon = 'ios-play';
    this.playing = false;
    this.stream.pause();
  };
         
  dismiss(){
    this._viewCtrl.dismiss();
  }

  updateProgress() {
    if (this.stream.currentTime > 0) {
        this.playProgress = Math.floor((100 / this.stream.duration) * this.stream.currentTime);
    }
  }

  dragTo(progress: number){
    this.stream.currentTime = progress/1000 * this.stream.duration;
    this.play();
    console.log(this.stream.currentTime);
  }
}