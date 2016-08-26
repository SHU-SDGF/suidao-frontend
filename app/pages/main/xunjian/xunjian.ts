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
  private _pageTitles: Array<string> = ['环境巡检', '隧道巡检'];
  private _pageTitle: string;

  constructor(private _menuCtrl: MenuController){
    super(_menuCtrl);
    this._pageTitle = this._pageTitles[0];
  }

  private switchView(){
    this._pageTitle = this._pageTitles[<any>this['onGround'] | 0];
    this.onGround = !this.onGround;
  }
}