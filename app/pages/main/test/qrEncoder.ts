import {Component, OnInit} from '@angular/core';

@Component({
    template: `
      <ion-content>
        <textarea [(ngModel)]="text"></textarea>
        <button id="take" (click)="encode()">Encode</button><br />
        <canvas id="canvas" width="256" height="256"></canvas>
      </ion-content>
    `
})
export class QREncoder implements OnInit {
  private text = '';

  ngOnInit(){

  }

  encode(){
    /*
    var options = {
      render: 'canvas',
      ecLevel: 'H',
      minVersion: 6,
      fill: '#000',
      background: '#fff',
      text: this.text,
      size: 256,
      radius: 0,
      quiet: 1,
      mode: 2,
      mSize: 0.11,
      mPosX: 50 * 0.01,
      mPosY: 50 * 0.01
    };
    var $canvas = $('#result');
    $canvas.empty()['qrcode'](options);
    */

    $("#canvas")['qrcode']({
        text: this.text,
        background: '#fff',
        foreground: '#000',
        jbtype: 'r',
        dr: '',
        old_dr: 'yes',
        dan_w: 256,
        dan_l: 256,
        icon_src: false
    });
  }
  
}