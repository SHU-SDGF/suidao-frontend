import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import {
  Component, OnInit, OnDestroy, ViewChild, NgZone,
  EventEmitter
} from '@angular/core';
import {
  MenuController, Events, ToastController,
  AlertController, ModalController, NavController,
  LoadingController, Loading
} from 'ionic-angular';
import { ActivityInfoComponent } from './components/activity-info/activity-info.component';
import { XunjianComponent } from '../xunjian.component';
import { SearchComponent } from './components/search/search.component';
import { EnvironmentActivitySummary } from '../../../../../models/EnvironmentActivitySummary';
import { SuidaoMap, MapOptions, MarkerOptions, MapEvent } from '../../../../shared/components/suidao-map/suidao-map.component';
import { EnvironmentActivityService } from '../../../../providers/environment-activity-service';
import { UserService } from '../../../../providers/user-service';
import { ControlAnchor } from 'angular2-baidu-map';
import * as $ from 'jquery';

@Component({
  selector: 'ground',
  templateUrl: './ground.component.html',
  styles: ['./ground.component.scss']
})
export class GroundComponent implements OnInit, OnDestroy {
  private isEditing = false; // editing status  
  private opts: MapOptions;
  private mapOptionEmitter: EventEmitter<MapOptions> = new EventEmitter<MapOptions>();
  private _unsavedMarker: MarkerOptions = null;
  private _toast: any;
  private _searchPoped: boolean = false;
  private environmentActivityList: Array<EnvironmentActivitySummary>;
  private _pageEntered = false;
  private _isCurrent = true;
  private _mapLoader: Loading;
  
  @ViewChild(SuidaoMap) _suidaoMap: SuidaoMap;

  constructor(
    private _menuCtrl: MenuController,
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

  private viewSwtichSubscriber(onGround) {
    if (onGround) {
      this.pageEnter();
      this._isCurrent = true;
    } else {
      this.pageLeave();
      this._isCurrent = false;
    }
  }

  private tabChangeEventSubscriber(components) {
    if (components === XunjianComponent && this._isCurrent) {
      this.pageEnter();
    } else {
      this.pageLeave();
    }
  };

  /**
   * toggle editing */
  private toggleEditing () {
    this._zoon.run(() => {
      $('ion-tabs a.tab-button').toggleClass('active');
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
  }
  
  pageEnter() {
    if (this._pageEntered) return;
    // bind add button event
    $('.map-pin-button').remove();
    let $ele = $(`
      <a class="tab-button has-icon icon-only disable-hover map-pin-button">
        <ion-icon class="tab-button-icon ion-md-pin-outline"></ion-icon>
      </a>
    `);
    let $secBtn = $('ion-tabs a.tab-button').eq(1);
    $ele.insertAfter($secBtn);
    $ele.on('click', this.toggleEditing.bind(this));
    
    if (this.isEditing) {
      this.toggleEditing();
    }
    this._pageEntered = true;
  }

  pageLeave() {
    // unbind button event
    let $pinBtn = $('.map-pin-button');

    $pinBtn.unbind('click', this.toggleEditing.bind(this));
    $pinBtn.remove();

    if (this.isEditing) {
      this.toggleEditing();
    }
    this._pageEntered = false;
  }

  searchActivity() {
    if (this._searchPoped) return;
    let modal = this._modalCtrl.create(SearchComponent, {'environmentActivityList': this.environmentActivityList});
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
        dismissOnPageChange: true,
        duration: 3000
      });
      that._mapLoader.present();
    });
    

    this._event.subscribe('change-tab', this.tabChangeEventSubscriber.bind(this));
    this._event.subscribe('xunjian-view-switch', this.viewSwtichSubscriber.bind(this));
    
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
    
    this.environmentActivityService.getEnvironmentActivitiesSummaryList().subscribe((acts: Array<EnvironmentActivitySummary>) => {
      let markers = [];
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
    this._event.unsubscribe('change-tab', this.tabChangeEventSubscriber.bind(this));
    this.pageLeave();
  }

  public mapLongClick($event: MapEvent) {
    //this.opts.markers.push();
    if (!this.isEditing) return;
    if (this._unsavedMarker) {
      this._suidaoMap.removeMarker(this._unsavedMarker);
    }
    this._unsavedMarker = this._suidaoMap.addMarker({
      longitude: $event.point.lng,
      latitude: $event.point.lat,
      title: '新建标签',
      icon: 'assets/imgs/map-marker.png',
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
              this.removeUnsavedMarker();
              this.showToast();
            }
          },
          {
            text: '确认',
            handler: () => {
              this.openCreateModal($event);
            }
          }
        ]
      });
      alert.present();
    });
  }

  private getIcon(status){
    let types = {1: 'initial', 2: 'ongoing', 3: 'finished'};
    let type = types[status];
    return `assets/imgs/marker-${type}.png`;
  }

  private openCreateModal($event: MapEvent){

    let modal = this._modalCtrl.create(ActivityDetailComponent, {point: $event.point});
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
        icon: 'assets/imgs/marker-initial.png',
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

  public mapLoaded() {
    if (this._mapLoader.didLeave) return;
    this._mapLoader.dismiss();
  }

  public removeUnsavedMarker() {
    this._suidaoMap.removeMarker(this._unsavedMarker);
    this._unsavedMarker = null;
  }

  public clickMarker($event: { obj: MarkerOptions, marker: any }) {
    let _self = this;
    let modal = this._modalCtrl.create(ActivityInfoComponent, {'activityDetail': $event.obj});
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