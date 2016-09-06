import {Component, OnInit, OnDestroy,
  ViewChild, NgZone,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ModalController, PopoverController, PopoverOptions} from 'ionic-angular';
import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';
import {GroundPage} from './ground/ground';
import {UndergroundPage, TunnelOption} from './underground/underground';
import {SelectPopover} from '../../../shared/components/select-popover/select-popover';
import {LookupService} from '../../../providers/lookup_service';

@Component({
  templateUrl: './build/pages/main/xunjian/xunjian.html',
  directives: [GroundPage, UndergroundPage, SelectPopover]
})
export class XunjianPage extends ToggleMenu{
  private onGround: boolean = true;
  private directions: any;

  private structs = JSON.parse(localStorage.getItem("model_names"));

  private selectedTunnelOption: TunnelOption;

  constructor(
    private _menuCtrl: MenuController,
    private _modalCtrl: ModalController,
    private _popoverCtrl: PopoverController,
    private _lookupService: LookupService,
    private _zoon: NgZone,
    private _event: Events
  ) {
    super(_menuCtrl);
  }

  ngOnInit() {
    this.directions = JSON.parse(localStorage.getItem("monomers"));
    this.selectedTunnelOption = {
      direction: {"id": 1, name: "东线隧道"},
      struct: {"id": 3, name: "大型车道"}
    };

    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
  }

  private selectedTunnelDirectionChanged($event) {
    this.selectedTunnelOption.direction = $event;
    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
  };

  private selectedTunnelStructChanged($event) {
    this.selectedTunnelOption.struct = $event;
    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
  };

  private switchView() {
    this.onGround = !this.onGround;
    this._event.publish('xunjian-view-switch', this.onGround);
  }

  private tunnelOnchange(tunnelOption: TunnelOption) {
    this.selectedTunnelOption = tunnelOption;
  }
}