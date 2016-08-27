import {Component, OnInit, OnDestroy,
  ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ModalController, PopoverController, PopoverOptions} from 'ionic-angular';
import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';
import {GroundPage} from './ground/ground';
import {UndergroundPage, TunnelOption} from './underground/underground';
import {TunnelPicker} from './underground/components/tunnel-picker/tunnel-picker';

@Component({
  templateUrl: './build/pages/main/xunjian/xunjian.html',
  directives:[GroundPage, UndergroundPage]
})
export class XunjianPage extends ToggleMenu{
  private onGround: boolean = true;
  private tunnelName: string = '安全通道-东线';
  private selectedTunnelOption: TunnelOption;

  constructor(
    private _menuCtrl: MenuController,
    private _modalCtrl: ModalController,
    private _popoverCtrl: PopoverController) {
    super(_menuCtrl);
  }

  private switchView(){
    this.onGround = !this.onGround;
  }

  private pickTunnel($event) {
    let data = { selectedTunnelOption: this.selectedTunnelOption };
    let popoverOpts: PopoverOptions = {
      cssClass: 'tunnel-picker-popover'
    };
    let popover = this._popoverCtrl.create(TunnelPicker, data, popoverOpts);
    popover.present({ev: $event});
    popover.onDidDismiss(this.tunnelOnchange);
  }

  private tunnelOnchange(tunnelOption: TunnelOption) {
    this.selectedTunnelOption = tunnelOption;
  }
}