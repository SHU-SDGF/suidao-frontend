/// <reference path="../../../../typings/index.d.ts" />

import {Component, OnInit, OnDestroy, DynamicComponentLoader, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {MenuController, Events, Backdrop} from 'ionic-angular';
import {BaiduMap, OfflineOptions, ControlAnchor, NavigationControlType} from 'angular2-baidu-map';
import {toggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';

@Component({
  selector: 'map-presentation',
  templateUrl: './build/pages/main/ground/ground.html',
  directives: [BaiduMap]
})
export class GroundPage extends toggleMenu implements OnInit, OnDestroy {

  private isEditing = false;  
  opts: any;
  offlineOpts: OfflineOptions;

  constructor(private _menuCtrl: MenuController, private dcl: DynamicComponentLoader) {
    super(_menuCtrl);
    
  }

  showAddBg() {
    console.log('123');
  }

  ngOnInit() {
    this.opts = {
      center: {
        longitude: 121.506191,
        latitude: 31.245554
      },
      zoom: 17,
      markers: [{
        longitude: 121.506191,
        latitude: 31.245554,
        title: 'Where',
        content: 'Put description here',
        autoDisplayInfoWindow: true
      }],
      geolocationCtrl: {
        anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT
      },
      scaleCtrl: {
        anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
      },
      overviewCtrl: {
        isOpen: true
      },
      navCtrl: {
        type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
      }

    };


    this.offlineOpts = {
      retryInterval: 5000,
      txt: 'NO-NETWORK'
    };

    //$('#tab-t0-2')

    $('#tab-t0-2').on('click', this.toggleEditing);
  }

  toggleEditing() {
    $('#tab-t0-2').toggleClass('active');
    this.isEditing = !this.isEditing;
  }

  loadMap(e: any) {
    console.log(e);//e here is the instance of BMap.Map
  }

  clickMarker(marker: any) {
    let _self = this;
  }

  ngOnDestroy() {
    $('#tab-t0-2').unbind('click', this.toggleEditing);
    $('#tab-t0-2').removeClass('active');
  }

}