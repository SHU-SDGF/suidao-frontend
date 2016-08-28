/// <reference path="../../../../../typings/index.d.ts" />

import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ToastController, AlertController, ModalController, NavController} from 'ionic-angular';
import {SuidaoMap, OfflineOptions, MapOptions, ControlAnchor, NavigationControlType, MapEvent, MarkerOptions} from '../../../../shared/components/suidao-map/suidao-map';
import {ActivityDetailPage} from './components/activity_detail/activity_detail';
import {ActivityInfoPage} from './components/activity_info/activity_info';
import { EnvironmentActivityService } from '../../../../providers';
import {Geolocation} from 'ionic-native';
import {XunjianPage} from '../xunjian';
import {SearchPage} from './components/search/search';

@Component({
  selector: 'ground-page',
  templateUrl: './build/pages/main/xunjian/ground/ground.html',
  directives: [SuidaoMap]
})
export class GroundPage implements OnInit, OnDestroy {
  private isEditing = false; // editing status  
  private opts: MapOptions;
  private offlineOpts: any;
  private mapOptionEmitter: EventEmitter<MapOptions> = new EventEmitter<MapOptions>();
  private _unsavedMarker: MarkerOptions = null;
  private _toast: any;
  private _searchPoped: boolean = false;
  private markers: any;
  private environmentActivityList: any;

  @ViewChild(SuidaoMap) _suidaoMap: SuidaoMap;

  constructor(
    private _menuCtrl: MenuController,
    private dcl: DynamicComponentLoader,
    private _toastController: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private environmentActivityService: EnvironmentActivityService,
    private _event: Events
  ) { }


  tabChangeEventSubscriber = function(components) {
      if (components[0] === XunjianPage) {
        this.pageEnter();
      } else {
        this.pageLeave();
      }
  }.bind(this);
  
  pageEnter() {
    // bind add button event
    $('ion-tabbar a.tab-button').eq(2).on('click', this.toggleEditing.bind(this));
    $('ion-tabbar a.tab-button').eq(2).show();
    if (this.isEditing) {
      this.toggleEditing();
    }
  }

  pageLeave() {
    // unbind button event
    $('ion-tabbar a.tab-button').eq(2).unbind('click', this.toggleEditing.bind(this));
    $('ion-tabbar a.tab-button').eq(2).hide();
    if (this.isEditing) {
      this.toggleEditing();
    }
  }

  searchActivity() {
    if (this._searchPoped) return;
    let modal = this._modalCtrl.create(SearchPage, {'environmentActivityList': this.environmentActivityList});
    modal.present();
    modal.onDidDismiss(() => {
      this._searchPoped = false;
    });
    this._searchPoped = true;
  }

  ngOnInit() {
    let that = this;
    this._event.subscribe('change-tab', this.tabChangeEventSubscriber);
    this._navCtrl.viewDidLeave.subscribe(this.pageLeave);

    this.opts = {
      center: {
        longitude: 121.487181,
        latitude: 31.241721,
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
    
    this.environmentActivityService.getEnvironmentActivitiesSummaryList().then((result) => {
      let markers = [];
      let centerCord = {
        longitude: 0,
        latitude: 0
      };
      that.environmentActivityList = result["content"];

      if(result["content"].length == 0) {
        centerCord = {
          longitude: 121.506191,
          latitude: 31.245554
        };
      } else {
        centerCord = {
          longitude: result["content"][0]["longitude"],
          latitude: result["content"][0]["latitude"]
        }
        for(var index in result["content"]) {
          markers.push({
            longitude: result["content"][index]["longtitude"],
            latitude: result["content"][index]["latitude"],
            title: result["content"][index]["actName"],
            icon: 'build/imgs/map-marker.png',
            description: result["content"][index]["description"],
            width: 30,
            height: 30,
            actStatus: result["content"][index]["actStatus"],
            actType: result["content"][index]["actType"],
            recorder: result["content"][index]["recorder"],
            content: '',
            inspDate: result["content"][index]["inspDate"],
            actNo: result["content"][index]["actNo"]
          });
        }
      }
      that.opts.markers = that.opts.markers.concat(markers);

      that.mapOptionEmitter.emit(that.opts);
      that.offlineOpts = {
        retryInterval: 5000,
        txt: 'NO-NETWORK'
      };
    }, (error) => {
      console.log('error');
    });
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
    this.pageLeave();
    this._event.unsubscribe('change-tab', this.tabChangeEventSubscriber);
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
                  _self.environmentActivityList.unshift({
                    actName: activity["environmentActitivitySummary"]["actName"],
                    actNo: activity["environmentActitivitySummary"]["actNo"],
                    actStatus: activity["environmentActivity"]["actStatus"],
                    createUser: activity["environmentActitivitySummary"]["createUser"],
                    description: activity["environmentActitivitySummary"]["description"],
                    endDate: activity["environmentActitivitySummary"]["endDate"],
                    id: activity["environmentActitivitySummary"]["id"],
                    inspDate: activity["environmentActivity"]["inspDate"],
                    latitude: activity["environmentActitivitySummary"]["latitude"],
                    longtitude: activity["environmentActitivitySummary"]["longtitude"],
                    startDate: activity["environmentActitivitySummary"]["startDate"],
                  });
                  _self.toggleEditing();
                  _self.removeUnsavedMarker();

                  // refresh markers
                  let newMarker = {
                    id: activity["environmentActitivitySummary"]["id"],
                    longitude: activity["environmentActitivitySummary"]["longtitude"],
                    latitude: activity["environmentActitivitySummary"]["latitude"],
                    title: activity["environmentActitivitySummary"]["actName"],
                    icon: 'build/imgs/map-marker.png',
                    description: activity["environmentActitivitySummary"]["description"],
                    width: 30,
                    height: 30,
                    actStatus: activity["environmentActivity"]["actStatus"],
                    actType: activity["environmentActivity"]["actType"],
                    recorder: activity["environmentActivity"]["recorder"],
                    content: '',
                    inspDate: activity["environmentActivity"]["inspDate"],
                    actNo: activity["environmentActivity"]["actNo"]
                  };

                  _self._suidaoMap.addMarker(newMarker);
                  _self._suidaoMap.changeCenter({
                    lat: activity["environmentActitivitySummary"]["latitude"],
                    lng: activity["environmentActitivitySummary"]["longtitude"]
                  })

                  console.log("dismiss");
                  
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
    Geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });
  }

  private removeUnsavedMarker() {
    this._suidaoMap.removeMarker(this._unsavedMarker);
    this._unsavedMarker = null;
  }

  private clickMarker($event: { obj: MarkerOptions, marker: any }) {
    let that = this;
    setTimeout(($event) => {
      let modal = this._modalCtrl.create(ActivityInfoPage, {'activityDetail': $event.obj});
      modal.present(modal);
      modal.onDidDismiss(() => {
      });
    },0, $event);
  }
}