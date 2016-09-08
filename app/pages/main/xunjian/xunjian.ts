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
  @ViewChild(UndergroundPage) _underGroundPage: UndergroundPage;
  @ViewChild('mainContent') _mainContent: ElementRef;
  @ViewChild('header') _header: ElementRef;

  private structs = JSON.parse(localStorage.getItem("model_names"));

  private selectedTunnelOption: TunnelOption;

  OPTIONCHANGE_EVENT: string = "optionChange";
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

  private selectedTunnelDirectionChanged($event) {
    this.selectedTunnelOption.direction = $event;
    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
    this._events.publish(this.OPTIONCHANGE_EVENT);
  };

  private selectedTunnelStructChanged($event) {
    this.selectedTunnelOption.struct = $event;
    localStorage.setItem('tunnelOption', JSON.stringify(this.selectedTunnelOption));
    this._events.publish(this.OPTIONCHANGE_EVENT);
  };

  private switchView() {
    this.onGround = !this.onGround;
    this._events.publish('xunjian-view-switch', this.onGround);
    setTimeout(()=>{
      console.log(this._mainContent['_elementRef'].nativeElement);
      let $scrollContent = $(this._mainContent['_elementRef'].nativeElement).find('scroll-content').eq(0);
      $($scrollContent).css({"marginTop": $(this._header.nativeElement).height()});
    });
  }

  private tunnelOnchange(tunnelOption: TunnelOption) {
    this.selectedTunnelOption = tunnelOption;
  }

  private scanCode(){
    this._underGroundPage.scanCode();
  }
}