/// <reference path="../../../../typings/index.d.ts" />

import {Component, OnInit, DynamicComponentLoader, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {MenuController, Events, Backdrop} from 'ionic-angular';
import {BaiduMap, OfflineOptions, ControlAnchor, NavigationControlType} from 'angular2-baidu-map';

@Component({
  selector: 'map-presentation',
  templateUrl: './build/pages/main/ground/ground.html',
  directives: [BaiduMap]
})
export class GroundPage implements OnInit, AfterViewInit {

  opts: any;
  offlineOpts: OfflineOptions;
  public menuTipOptions: any = [
    {
      icon: 'fa-plus',
      action: function () {
        console.log('123');
      },
      tip: ''
    },
    {
      icon: 'fa-plus',
      action: function () {
        console.log('123');
      },
      tip: ''
    },
    {
      icon: 'fa-plus',
      action: function () {
        console.log('123');
      },
      tip: ''
    }
  ];

  ngAfterViewInit(){
    let _self = this;
    
  }

  toggleMenu() {
    this.menuCtrl.toggle();
    if (!this.menuCtrl.getMenus()[0].isOpen) {
      $('.menu-content-push').addClass('menu-content-open');
    } else {
      $('.menu-content-push').removeClass('menu-content-open');
    }
  }

  constructor(private menuCtrl: MenuController, private dcl:DynamicComponentLoader) {
    let _self = this;
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

    
  }

  loadMap(e: any) {
    console.log(e);//e here is the instance of BMap.Map
  }

  clickMarker(marker: any) {
    let _self = this;
  }

}