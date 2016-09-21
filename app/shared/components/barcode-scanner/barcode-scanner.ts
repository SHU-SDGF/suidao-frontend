import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
declare const navigator, MediaStreamTrack;

@Component({
  selector: 'image-editor',
  template: `
    <ion-content>
      <button class="back-btn" (click)="goBack()">返回</button>
      <video id="v"></video>
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
export class BarCodeScanner{

  constructor(private _viewCtrl: ViewController){
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      console.log('media found!!!');
    }
  }

  /*
  ngOnInit() {
    function userMedia() {
      return navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia || null;
    }
    this.getMediaSources();

    // Now we can use it
    if( userMedia() ){
      var videoPlaying = false;
      var constraints = {
          video: true,
          audio:false
      };
      var video = document.getElementById('v');

      var media = navigator.getUserMedia(constraints, function(stream){
        // URL Object is different in WebKit
        var url = window.URL || window['webkitURL'];

        // create the url and set the source of the video element
        video['src'] = url ? url.createObjectURL(stream) : stream;

        // Start the video
        video['play']();
        videoPlaying  = true;
      }, function(error){
        console.log("ERROR");
        console.log(error);
      });
      
    } else {
        console.log("KO");
    }
  }
  */

  private getMediaSources(){
    function gotSources(sourceInfos: Array<any>) {
      sourceInfos.forEach(info=>{
        console.log(JSON.stringify(info));
      });
      console.log(sourceInfos);
    }

    if (typeof MediaStreamTrack === 'undefined' ||
        typeof MediaStreamTrack.getSources === 'undefined') {
      alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
    } else {
      MediaStreamTrack.getSources(gotSources);
    }
  }

  private goBack(){
    this._viewCtrl.dismiss();
  }
}