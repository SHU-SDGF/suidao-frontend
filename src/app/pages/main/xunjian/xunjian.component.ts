import { UndergroundComponent, TunnelOption } from './underground/underground.component';
import { LookupService } from '../../../providers/lookup-service';
import {
  Component,
  ViewChild, NgZone,
  ElementRef
} from '@angular/core';
import { MenuController, Events, ModalController, PopoverController } from 'ionic-angular';
import { ToggleMenu } from '../../../shared/components/toggle-menu/toggle-menu.component';

import * as $ from 'jquery';

@Component({
  templateUrl: './xunjian.component.html',
  styles: ['./xunjian.component.scss']
})
export class XunjianComponent extends ToggleMenu{
  private onGround: boolean = true;
  private directions: any;
  @ViewChild(UndergroundComponent) _underGroundComponent: UndergroundComponent;
  @ViewChild('mainContent') _mainContent: ElementRef;
  @ViewChild('header') _header: ElementRef;

  public structs = JSON.parse(localStorage.getItem("model_names"));

  private selectedTunnelOption: TunnelOption;
  private searchArg = "";

  OPTIONCHANGE_EVENT: string = "optionChange";
  SEARCHINSPACT_EVENT: string = "searchInspAct";
  constructor(
    private _menuCtrl: MenuController,
    private _modalCtrl: ModalController,
    private _popoverCtrl: PopoverController,
    private _lookupService: LookupService,
    private _zoon: NgZone,
    private _events: Events
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

  onInput(event) {
    this._events.publish(this.SEARCHINSPACT_EVENT, this.searchArg);
    console.log(event);
  }

  public selectedTunnelDirectionChanged($event) {
    this.selectedTunnelOption.direction = {
      "id": parseInt($event["id"]),
      "name": $event["name"]
    }
    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
    this._events.publish(this.OPTIONCHANGE_EVENT);
  };

  public selectedTunnelStructChanged($event) {
    this.selectedTunnelOption.struct = {
      "id": parseInt($event["id"]),
      "name": $event["name"]
    };
    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
    this._events.publish(this.OPTIONCHANGE_EVENT);
  };

  public switchView() {
    this.onGround = !this.onGround;
    this._events.publish('xunjian-view-switch', this.onGround);
    setTimeout(()=>{
      let $scrollContent = $(this._mainContent['_elementRef'].nativeElement).find('scroll-content').eq(0);
      $($scrollContent).css({"marginTop": $(this._header.nativeElement).height()});
    });
  }

  public tunnelOnchange(tunnelOption: TunnelOption) {
    this.selectedTunnelOption = tunnelOption;
  }

  public scanCode(){
    this._underGroundComponent.scanCode();
  }
}