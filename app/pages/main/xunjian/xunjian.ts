import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ToastController, AlertController, ModalController, NavController} from 'ionic-angular';
import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';
import {GroundPage} from './ground/ground';
import {UndergroundPage} from './underground/underground';

@Component({
  templateUrl: './build/pages/main/xunjian/xunjian.html',
  directives:[GroundPage, UndergroundPage]
})
export class XunjianPage extends ToggleMenu{
  private onGround: boolean = true;

  constructor(private _menuCtrl: MenuController){
    super(_menuCtrl);
  }

  private switchView(){
    this.onGround = !this.onGround;
  }
}