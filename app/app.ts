import {Component, ViewChild, OnInit} from '@angular/core';
import {Platform, ionicBootstrap, ModalController, Nav, NavController, MenuController, AlertController, LoadingController, Events} from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import {LoginPage} from './pages/login/login';
import * as _providers from './providers';
import { UserService } from './providers/user_service';
import { LookupService } from './providers/lookup_service';
import {MainPage} from './pages/main/main';
import { FacilityInspService } from './providers/facility_insp_service';
import {SyncDownloadPage} from './pages/main/sync_download/sync_download';
import {SyncUploadPage} from './pages/main/sync_upload/sync_upload';

declare const $: any;
const ANOM_USER = '未登录';

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;
  
  private rootPage: any;
  private userDisplayName: string = ANOM_USER;
  private loader = null;

  /**
   * app init */
  constructor(
    private platform: Platform,
    public menu: MenuController,
    private userService: UserService,
    private lookupService: LookupService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private facilityInspService: FacilityInspService,
    private _modalCtrl: ModalController,
    private events: Events
  ) {

    platform.ready().then(() => {
      lookupService.initDB();
      StatusBar.styleDefault();
      Splashscreen.hide();
      let _self = this;
      this.menu.enable(true, 'user-menu');
      
      userService.hasLoggedIn().then(function(loggedIn: boolean){
        if(loggedIn){
          _self.nav.setRoot(MainPage);
        }else{
          _self.nav.setRoot(LoginPage);
          //_self.nav.setRoot(MainPage);
        }
      })
    });
  }

  ngOnInit() {

    this.userService.hasLoggedIn().then((flag) => {
      if (flag) {
        this.userService.getUserInfo().then((userInfo) => {
          this.userDisplayName = userInfo.userName;
        });
      } else {
        this.userDisplayName = ANOM_USER;
      }
      
    });
    
    this.events.subscribe(this.userService.LOGIN_EVENT, () => {
      this.userService.getUserInfo().then((userInfo) => {
        this.userDisplayName = userInfo.userName;
      });
    });

    this.events.subscribe(this.userService.LOGOUT_EVENT, () => {
      this.userDisplayName = ANOM_USER;
    });

  }

  /**
   * user logout */
  logout() {
    let confirm = this.alertController.create({
      title: '确认要登出吗？',
      message: '用户登出后本地数据将会被清空！',
      buttons: [
        {
          text: '取消'
        },
        {
          text: '同意',
          handler: () => {
            this.userService.logout();
            this.menu.close().then(()=>{
              this.nav.setRoot(LoginPage);
            });
          }
        }
      ]
    });

    confirm.present();
  }

  syncUpload() {
    // this.generateFacilityInspRecordList().then((result) => {
    //   this.facilityInspService.uploadFacilityRecords(result).subscribe((res1) => {
    //     this.facilityInspService.deleteAllFacilityInsps().then((res2) => {
    //        //删除完毕
    //     })
    //   }, (error) => {
    //     console.log(error);
    //   });
    // });
    this._modalCtrl.create(SyncUploadPage).present();
    /*
    this.loader = this.loadingController.create({
      content: "数据同步中。。。",
    });
    this.loader.present();

    this.generateFacilityInspRecordList()
      .then(this.uploadFacilityRecords.bind(this))
      .then(this.deleteAllFacilityInsps.bind(this))
      .then(this.downloadFacilityRecords.bind(this))
      .then(this.saveFacilityRecordsToLocalDB.bind(this))
      .catch(function(error){
        let alert = this.alertController.create({
          title: '错误',
          subTitle: '同步数据出现错误，请重新同步数据',
          buttons: ['确认']
        });
      }.bind(this));
      */
  }

  private syncDownload(){
    this._modalCtrl.create(SyncDownloadPage).present();
  }

  syncDelete() {
    this.facilityInspService.deleteAllFacilityInsps().then((result) => {
    }, (error) => {
    })
  }

  private saveFacilityRecordsToLocalDB(result) {
    console.log('starting save to local db');
    console.log(result);
    this.facilityInspService.saveFacilityRecordsToLocalDB(result).then((result) => {
      //成功！！
      $('.loading-cmp').hide();

      //发布事件
      this.events.publish('optionChange');
      // let alert = this.alertController.create({
      //   subTitle: '数据同步成功！',
      //   buttons: ['确认']
      // });
      // alert.present();
    },(error) => {
      console.log(error);
    })
  }

  private downloadFacilityRecords() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.downloadFacilityRecords().subscribe((result) => {
        console.log('downloading successfully!');
        console.log(result);
        resolve(result);
      },(error) => {
        console.log('download failed');
        console.log(error);
        reject(error);
      });
    });

    return promise;
  }

  private deleteAllFacilityInsps() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.deleteAllFacilityInsps().then((result) => {
        console.log('delete successfully!');
        console.log(result);
        resolve();
      })
    });
    return promise;
  }

  private uploadFacilityRecords(facilityInspRecordList) {
    var promise = new Promise((resolve, reject) => {
      if(facilityInspRecordList.length != 0) {
        this.facilityInspService.uploadFacilityRecords(facilityInspRecordList).subscribe((result) => {
          console.log('uploading successfully!');
          console.log(result);
          resolve(result);
        },(error) => {
          console.log('uploading failed');
          console.log(error);
          reject(error);
        });
      } else {
        resolve({'ok': true});
      }
    });
    return promise;
  }

  private generateFacilityInspRecordList() {
    return new Promise((resolve, reject) => {
      let facilityInspList = [];
      let facilityInspDetailsList = [];
      let facilityInspRecordList = [];
      this.facilityInspService.getAllFacilityInspSummaries().then((result) => {
        facilityInspList = result;
        console.log(result);
        //同步api
        this.facilityInspService.getAllFacilityInspDetails().then((res) => {
          facilityInspDetailsList = res;
          for(let index in facilityInspList){
            let facilityInspObj = {
              "facilityInspSum": facilityInspList[index],
              "facilityInspDetailList": []
            };

            let diseaseNo = facilityInspList[index]["diseaseNo"];
            for(let index2 in facilityInspDetailsList) {
              if(diseaseNo == facilityInspDetailsList[index2]["diseaseNo"]) {
                facilityInspObj["facilityInspDetailList"].push(facilityInspDetailsList[index2]);
              }
            }
            facilityInspRecordList.push(facilityInspObj);
          }
          resolve(facilityInspRecordList);
        });
      });
    });
  }
}

// load providers
var providersAr = [];
for(let p in _providers ){
  providersAr.push(_providers[p]);
}

ionicBootstrap(MyApp, providersAr, {
  mode : 'ios',
  backButtonText: "返回"
});
