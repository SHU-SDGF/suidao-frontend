/// <reference path="../../../../typings/index.d.ts" />

import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ToastController, AlertController, ModalController, NavController} from 'ionic-angular';
import {ToggleMenu} from '../../../shared/components/toggle-menu/toggle-menu';
import {SuidaoMap, OfflineOptions, MapOptions, ControlAnchor, NavigationControlType, MapEvent, MarkerOptions} from '../../../shared/components/suidao-map/suidao-map';
import {ActivityDetailPage} from './components/activity_detail/activity_detail';
import {ActivityInfoPage} from './components/activity_info/activity_info';
import { EnvironmentActivityService } from '../../../providers';

@Component({
  templateUrl: './build/pages/main/ground/ground.html',
  directives: [SuidaoMap]
})
export class GroundPage extends ToggleMenu implements OnInit, OnDestroy {
  private onGround: boolean = true;
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
    private _toastController: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private environmentActivityService: EnvironmentActivityService
  ) {
    super(_menuCtrl);
  }

  ngOnInit() {
    // bind add button event
    $('ion-tabbar a.tab-button').eq(2).on('click', ((_self) => {
      return function () {
        _self.toggleEditing.apply(_self);
      }
    })(this));

    this.environmentActivityService.getEnvironmentActivitiesSummaryList().then((result) => {
      // let markers = [];
      // for(var obj in result.content) {
      //   markers.push = {
      //     longitude: 121.405679,
      //     latitude: 31.170997,
      //     title: '环境活动000',
      //     icon: 'build/imgs/map-marker.png',
      //     width: 30,
      //     height: 30,
      //     content: ``
      //   }
      // } 
      // this.opts = {
      //   center: {
      //     longitude: 121.506191,
      //     latitude: 31.245554
      //   },
      //   zoom: 17
      // }
      // debugger;
    }, (error) => {
    });


    this.opts = {
      center: {
        
      },
      zoom: 17,
      markers: [{
        longitude: 121.405679,
        latitude: 31.170997,
        title: '环境活动000',
        icon: 'build/imgs/map-marker.png',
        width: 30,
        height: 30,
        content: ``
      },{
        longitude: 121.487181,
        latitude: 31.241721,
        title: '环境活动001',
        icon: 'build/imgs/map-marker.png',
        width: 30,
        height: 30,
        content: ``
      },{
        longitude: 121.450184,
        latitude: 31.254985,
        title: '环境活动002',
        icon: 'build/imgs/map-marker.png',
        width: 30,
        height: 30,
        content: ``
      }],
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
    $('ion-tabbar a.tab-button').toggleClass('active');
    this.isEditing = !this.isEditing;
    if (this._unsavedMarker) {
      this._suidaoMap.removeMarker(this._unsavedMarker);
    }
    
    if (this.isEditing) {
      this.showToast();
    } else {
      this.hideToast();
    }
  }

  private showToast() {
    this._toast = this._toastController.create({
      message: '请双击地图位置添加新的环境活动.',
      position: 'top',
      dismissOnPageChange: true
    });
    return this._toast.present();
  }

  private hideToast() {
    if (!this._toast) return;
    return this._toast.dismiss();
  }

  /**
   * collect when destroyed */
  ngOnDestroy() {
    $('#tab-t0-2').unbind('click', this.toggleEditing);
    $('#tab-t0-2').removeClass('active');
  }

  private mapLongClick($event: MapEvent) {
    //this.opts.markers.push();
    let _self = this;
    if (!this.isEditing) return;
    if (this._unsavedMarker) {
      this._suidaoMap.removeMarker(this._unsavedMarker);
    }
    this._unsavedMarker = this._suidaoMap.addMarker({
      longitude: $event.point.lng,
      latitude: $event.point.lat,
      title: '新建标签',
      icon: 'build/imgs/map-marker.png',
      width: 30,
      height: 30
    });
    //this._suidaoMap.changeCenter($event.point);
    
    this.hideToast().then(() => {
      let alert = this._alertCtrl.create({
        title: '添加环境活动',
        message: '你确认要在此处添加环境活动吗?',
        cssClass: 'alert-bottom',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              _self.removeUnsavedMarker();
              _self.showToast();
            }
          },
          {
            text: '确认',
            handler: () => {
              alert.dismiss().then(() => {
                let modal = _self._modalCtrl.create(ActivityDetailPage, {point: $event.point});
                modal.present();
                modal.onDidDismiss((activity) => {
                  _self.toggleEditing();
                  if (!activity) {
                    _self.removeUnsavedMarker();
                  }
                });
              });
            }
          }
        ]
      });
      alert.present();
    });
  }

  private mapLoaded(){
    
  }

  private removeUnsavedMarker() {
    this._suidaoMap.removeMarker(this._unsavedMarker);
    this._unsavedMarker = null;
  }

  private clickMarker($event: { obj: MarkerOptions, marker: any }) {
    setTimeout(() => {
      let modal = this._modalCtrl.create(ActivityInfoPage);
      modal.present();
    });
  }

  private switchView(){
    this.onGround = !this.onGround;
  }
}