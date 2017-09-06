import { Observable, Subscription } from 'rxjs/Rx';
import {NavParams, ViewController} from 'ionic-angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';

import {MediaContent} from '../../../../models/MediaContent';
import {MediaService} from '../../../providers/media-service';

@Component({
  template: `
        <ion-item>
          <ion-range [(ngModel)]="playProgress" min="0" max="100" step="0.1" (ionChange)="dragTo(playProgress)">
            <ion-icon range-left name="{{icon}}" (click)="togglePlay()"></ion-icon>
          </ion-range>
          <div><span>{{stream?.currentTime | TimePipe}} / {{stream?.duration | TimePipe}}</span></div>
        </ion-item>
  `,
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  
  private playProgress: number = 0;
  private playing: boolean = false;
  private media: MediaContent;
  private url: string;
  private icon: string = 'ios-play';
  private file: MediaObject;
  private subscriptions: Subscription[] = [];
  private timer: number;

  constructor(
    private _viewCtrl: ViewController,
    private params: NavParams,
    private _mediaService: MediaService,
    private nativeMedia: Media,
  ) { }

  async ngOnInit() {
    this.media = this.params.get('media');
    this.url = await this._mediaService.getMediaPath(this.media);

    // Create a Media instance.  Expects path to file or url as argument
    // We can optionally pass a second argument to track the status of the media
    this.file = this.nativeMedia.create(this.url);

    // to listen to plugin events:
    let s1 = this.file.onStatusUpdate.subscribe(status => {
      if (status === 4) {
        this.pause();
        this.dragTo(0);
      }
    }); // fires when file status changes
    let s2 = this.file.onSuccess.subscribe(() => console.log('Action is successful'));
    let s3 = this.file.onError.subscribe(error => console.log('Error!', error));

    this.subscriptions = [s1, s2, s3];
    this.timer = setInterval(this.updateProgress.bind(this), 100);

  }

  async ngOnDestroy() {
    this.file.release();
    this.subscriptions.forEach(s => s.unsubscribe());
    clearInterval(this.timer);
  }

  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {

    // play the file
    this.file.play();
    this.playing = true;
    this.icon = 'ios-pause';
  }

  pause() {
    this.icon = 'ios-play';
    this.playing = false;
    this.file.pause();
  };
         
  dismiss() {
    this._viewCtrl.dismiss();
  }

  async updateProgress() {
    let position = await this.file.getCurrentPosition();
    let duration = this.file.getDuration();
    if (position > 0) {
      this.playProgress = Math.floor((100 / duration) * position);
    }
  }

  dragTo(progress: number) {
    const duration = this.file.getDuration();
    this.file.seekTo(progress / 1000 * duration);
    // this.play();
    // console.log(this.stream.currentTime);
  }
}
