/// <reference path="../../../../typings/index.d.ts" />

import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  EventEmitter} from '@angular/core';
import {Events, MenuController,
  AlertController, 
  ModalController} from 'ionic-angular';

import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';

@Component({
  templateUrl: './build/pages/main/underground/underground.html'
})
export class UndergroundPage extends ToggleMenu implements OnInit, OnDestroy {

  constructor(
    private _menuCtrl: MenuController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ){
    super(_menuCtrl);
  }

  ngOnInit(){

  }

  ngOnDestroy(){

  }

  goGround(){
    
  }
}
