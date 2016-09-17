/// <reference path="../../../../../typings/index.d.ts" />

import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild, NgZone,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ToastController, AlertController, ModalController, NavController, LoadingController, Loading} from 'ionic-angular';
import {SuidaoMap, OfflineOptions, MapOptions, ControlAnchor, NavigationControlType, MapEvent, MarkerOptions} from '../../../../shared/components/suidao-map/suidao-map';
import {ActivityDetailPage} from './components/activity_detail/activity_detail';
import {ActivityInfoPage} from './components/activity_info/activity_info';
import { EnvironmentActivityService, UserService } from '../../../../providers';
import {XunjianPage} from '../xunjian';
import {SearchPage} from './components/search/search';
import {EnvironmentActivitySummary} from '../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../models/EnvironmentActivity';

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
  private environmentActivityList: Array<EnvironmentActivitySummary>;
  private _pageEntered = false;
  private _isCurrent = true;
  private _mapLoader: Loading;
  
  @ViewChild(SuidaoMap) _suidaoMap: SuidaoMap;

  constructor(
    private _menuCtrl: MenuController,
    private dcl: DynamicComponentLoader,
    private _toastController: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController,
    private environmentActivityService: EnvironmentActivityService,
    private _event: Events,
    private _zoon: NgZone,
    private _loadingCtrl: LoadingController,
    private _userService: UserService
  ) { }

  private viewSwtichSubscriber = function (onGround) {
    if (onGround[0]) {
      this.pageEnter();
      this._isCurrent = true;
    } else {
      this.pageLeave();
      this._isCurrent = false;
    }
  }.bind(this);

  tabChangeEventSubscriber = function(components) {
    if (components[0] === XunjianPage && this._isCurrent) {
      this.pageEnter();
    } else {
      this.pageLeave();
    }
  }.bind(this);

  /**
   * toggle editing */
  toggleEditing = function () {
    this._zoon.run(() => {
      $('ion-tabbar a.tab-button').toggleClass('active');
      this.isEditing = !this.isEditing;
      if (this._unsavedMarker) {
        this._suidaoMap.removeMarker(this._unsavedMarker);
        this._unsavedMarker = null;
      }
      
      if (this.isEditing) {
        this.showToast();
      } else {
        this.hideToast();
      }
    });
  }.bind(this);
  
  pageEnter() {
    if (this._pageEntered) return;
    // bind add button event
    $('.map-pin-button').remove();
    let $ele = $(`
      <a class="tab-button has-icon icon-only disable-hover map-pin-button">
        <ion-icon class="tab-button-icon ion-md-pin-outline"></ion-icon>
      </a>
    `);
    let $secBtn = $('ion-tabbar a.tab-button').eq(1);
    $ele.insertAfter($secBtn);
    $ele.on('click', this.toggleEditing);
    
    if (this.isEditing) {
      this.toggleEditing();
    }
    this._pageEntered = true;
  }

  pageLeave() {
    // unbind button event
    let $pinBtn = $('.map-pin-button');

    $pinBtn.unbind('click', this.toggleEditing);
    $pinBtn.remove();

    if (this.isEditing) {
      this.toggleEditing();
    }
    this._pageEntered = false;
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

    setTimeout(() => {
      that._mapLoader = that._loadingCtrl.create({
        content: '地图加载中...',
        dismissOnPageChange: true
      });
      that._mapLoader.present();
    });
    

    this._event.subscribe('change-tab', this.tabChangeEventSubscriber);
    this._event.subscribe('xunjian-view-switch', this.viewSwtichSubscriber);
    
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
      },
      
    };
    
    this.environmentActivityService.getEnvironmentActivitiesSummaryList().subscribe((acts: Array<EnvironmentActivitySummary>) => {
      let markers = [];
      let centerCord = {
        longitude: 0,
        latitude: 0
      };
      this.environmentActivityList = acts;
      markers = this.environmentActivityList.map(activity=>{
        Object.assign(activity, {
          width: 30,
          height: 30,
          icon: this.getIcon(activity["actStatus"]),
          title: activity.actName,
          longitude: activity.longitude,
          latitude: activity.latitude
        });
        return activity;
      });

      that.opts.markers = that.opts.markers.concat(markers);
      that.mapOptionEmitter.emit(that.opts);
    }, (error) => {
      if(!error.ok){
        this._event.publish(this._userService.LOGOUT_EVENT);
      }
    });
  }

  private showToast() {
    this._toast = this._toastController.create({
      message: '长按地图位置添加新的环境活动。',
      position: 'top',
      dismissOnPageChange: true
    });
    this._toast.present();
  }

  private hideToast() {
    if (!this._toast) return;
    return this._toast.dismiss();
  }

  /**
   * collect when destroyed */
  ngOnDestroy() {
    this._event.unsubscribe('change-tab', this.tabChangeEventSubscriber);
    this.pageLeave();
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
                this.openCreateModal($event);
              });
            }
          }
        ]
      });
      alert.present();
    });
  }

  private getIcon(status){
    let types = ['initial', 'ongoing', 'finished'];
    let type = types[status];
    return `build/imgs/marker-${type}.png`;
  }

  private openCreateModal($event: MapEvent){

    let modal = this._modalCtrl.create(ActivityDetailPage, {point: $event.point});
    modal.present();
    modal.onDidDismiss((activity) => {
      this.removeUnsavedMarker();
      if (!activity) {
        this.toggleEditing();
        return;
      };
      this.environmentActivityList.unshift(EnvironmentActivitySummary.deserialize(activity["environmentActitivitySummary"]));
      this.toggleEditing();
      
      // refresh markers
      let newMarker = {
        id: activity["environmentActitivitySummary"]["id"],
        longitude: activity["environmentActitivitySummary"]["longtitude"],
        latitude: activity["environmentActitivitySummary"]["latitude"],
        title: activity["environmentActitivitySummary"]["actName"],
        icon: 'build/imgs/marker-initial.png',
        description: activity["environmentActitivitySummary"]["description"],
        width: 30,
        height: 30,
        actStatus: activity["environmentActivity"]["actStatus"],
        actType: activity["environmentActivity"]["actType"],
        recorder: activity["environmentActivity"]["recorder"],
        content: '',
        inspDate: activity["environmentActivity"]["inspDate"],
        actNo: activity["environmentActivity"]["actNo"],
        createUser: activity["environmentActitivitySummary"]["createUser"],
        startDate: activity["environmentActitivitySummary"]["startDate"],
        endDate: activity["environmentActitivitySummary"]["endDate"]
      };

      this._suidaoMap.addMarker(newMarker);
      this._suidaoMap.changeCenter({
        lat: this.environmentActivityList[0].latitude,
        lng: this.environmentActivityList[0].longitude
      });
    });
  };

  private mapLoaded() {
    this._mapLoader.dismiss();
  }

  private removeUnsavedMarker() {
    this._suidaoMap.removeMarker(this._unsavedMarker);
    this._unsavedMarker = null;
  }

  private clickMarker($event: { obj: MarkerOptions, marker: any }) {
    let _self = this;
    let modal = this._modalCtrl.create(ActivityInfoPage, {'activityDetail': $event.obj});
    modal.present(modal);
    modal.onDidDismiss((result) => {
      if(result) {
        let act = _self.environmentActivityList.find(act=> act['actNo'] == result["actNo"]);
        if(act){
          act["actStatus"] = result["actStatus"];
          act["description"] = result["description"];
          act["inspDate"] = result["inspDate"];
        }

        let marker = _self.opts.markers.find(marker => marker['actNo'] == result["actNo"]);
        if(marker){
          marker["actStatus"] = result["actStatus"];
          marker["description"] = result["description"];
          marker["inspDate"] = result["inspDate"];
          marker["icon"] = _self.getIcon(marker["actStatus"]);
        }
        _self._suidaoMap.removeMarker(marker);
        _self._suidaoMap.addMarker(marker);
      }
    });
  }
}