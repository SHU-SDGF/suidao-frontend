
import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ToastController, AlertController, ModalController, NavController} from 'ionic-angular';
import {Camera} from 'ionic-native';

declare const cordova;

@Component({
  selector: 'underground-page',
  templateUrl: './build/pages/main/xunjian/underground/underground.html'
})
export class UndergroundPage implements OnInit, OnDestroy {

  constructor(private _alertCtrl: AlertController){}

  ngOnInit(){

  }

  ngOnDestroy(){

  }

  scanCode(){
    cordova.plugins.barcodeScanner.scan((result) => {
        let alert = this._alertCtrl.create({
            title: "Scan Results",
            subTitle: result.text,
            buttons: ["Close"]
        });
        alert.present();
    }, (error) => {
      let alert = this._alertCtrl.create({
          title: "Scan Results",
          subTitle: error,
          buttons: ["Close"]
      });
      alert.present();
    });
  }
}

export interface TunnelOption{
  direction: { id: number, displayName: string },
  struct: {id: number, displayName: string}
}