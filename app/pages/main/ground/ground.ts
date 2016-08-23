/// <reference path="../../../../typings/index.d.ts" />

import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, Backdrop, ToastController} from 'ionic-angular';
import {toggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';
import {SuidaoMap, OfflineOptions, MapOptions, ControlAnchor, NavigationControlType, MapClickEvent, MarkerOptions} from '../../../shared/components/suidao-map/suidao-map';

@Component({
  selector: 'map-presentation',
  templateUrl: './build/pages/main/ground/ground.html',
  directives: [SuidaoMap]
})
export class GroundPage extends toggleMenu implements OnInit, OnDestroy {

  private isEditing = false; // editing status  
  private opts: MapOptions;
  private offlineOpts: any;
  private mapOptionEmitter: EventEmitter<MapOptions> = new EventEmitter<MapOptions>();
  private _unsavedMarker: MarkerOptions = null;
  private _toast: any;
  @ViewChild(SuidaoMap) _suidaoMap: SuidaoMap;

  constructor(
    private _menuCtrl: MenuController,
    private dcl: DynamicComponentLoader,
    private _toastController: ToastController
  ) {
    super(_menuCtrl);
  }

  ngOnInit() {
    // bind add button event
    $('#tab-t0-2').on('click', ((_self) => {
      return function () {
        _self.toggleEditing.apply(_self);
      }
    })(this));

    this.opts = {
      center: {
        longitude: 121.506191,
        latitude: 31.245554
      },
      zoom: 17,
      markers: [],
      geolocationCtrl: {
        anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
      },
      scaleCtrl: {
        anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT
      },
      overviewCtrl: {
        isOpen: false
      }
    };

    this.offlineOpts = {
        retryInterval: 5000,
        txt: 'NO-NETWORK'
    };
  }

  /**
   * toggle editing */
  toggleEditing() {
    $('#tab-t0-2').toggleClass('active');
    this.isEditing = !this.isEditing;
    if (this._unsavedMarker) {
      this._suidaoMap.removeMarker(this._unsavedMarker);
    }
    
    if (this.isEditing) {
      this._toast = this._toastController.create({
        message: '请点击地图添加新的环境活动.',
        position: 'top',
        dismissOnPageChange: true
      });
      this._toast.present();
    } else {
      this._toast.dismiss();
    }
  }

  /**
   * collect when destroyed */
  ngOnDestroy() {
    $('#tab-t0-2').unbind('click', this.toggleEditing);
    $('#tab-t0-2').removeClass('active');
  }

  private mapClick($event: MapClickEvent) {
    //this.opts.markers.push();
    if (!this.isEditing) return;
    if (this._unsavedMarker) {
      this._suidaoMap.removeMarker(this._unsavedMarker);
    }
    this._unsavedMarker = this._suidaoMap.addMarker({
      longitude: $event.point.lng,
      latitude: $event.point.lat,
      title: 'test',
      icon: 'build/imgs/map-marker.png',
      width: 30,
      height: 30
    });
    this._suidaoMap.changeCenter($event.point);
  }

  private clickMarker($event) {
    event.stopPropagation();
  }

}