import {Component, OnInit, OnDestroy,
  ViewChild, NgZone,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ModalController, PopoverController, PopoverOptions} from 'ionic-angular';
import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';
import {GroundPage} from './ground/ground';
import {UndergroundPage, TunnelOption} from './underground/underground';
import {SelectPopover} from '../../../shared/components/select-popover/select-popover';

@Component({
  templateUrl: './build/pages/main/xunjian/xunjian.html',
  directives: [GroundPage, UndergroundPage, SelectPopover]
})
export class XunjianPage extends ToggleMenu{
  private onGround: boolean = true;

  private directions = [
    { id: 1, displayName: '东线巡检' },
    { id: 1, displayName: '西线巡检' }
  ];

  private structs = [
    { id: 1, displayName: '安全通道' },
    { id: 2, displayName: '小型车道' },
    { id: 3, displayName: '大型通道' },
    { id: 4, displayName: '消防通道' },
    { id: 5, displayName: '安全通道' },
    { id: 6, displayName: '小型车道' },
    { id: 7, displayName: '大型通道' },
    { id: 8, displayName: '消防通道' },
    { id: 9, displayName: '安全通道' },
    { id: 10, displayName: '小型车道' },
    { id: 11, displayName: '大型通道' },
    { id: 12, displayName: '消防通道' },
  ];

  private selectedTunnelOption: TunnelOption = {
    direction: { id: 1, displayName: '东线巡检' },
    struct: { id: 1, displayName: '安全通道' }
  };

  constructor(
    private _menuCtrl: MenuController,
    private _modalCtrl: ModalController,
    private _popoverCtrl: PopoverController,
    private _zoon: NgZone,
    private _event: Events
  ) {
    super(_menuCtrl);
  }

  private switchView() {
    this.onGround = !this.onGround;
    this._event.publish('xunjian-view-switch', this.onGround);
  }

  private tunnelOnchange(tunnelOption: TunnelOption) {
    this.selectedTunnelOption = tunnelOption;
  }
}