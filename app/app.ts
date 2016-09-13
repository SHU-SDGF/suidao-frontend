import {Component, ViewChild, OnInit} from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController, AlertController, Events} from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import {LoginPage} from './pages/login/login';
import * as _providers from './providers';
import { UserService } from './providers/user_service';
import { LookupService } from './providers/lookup_service';
import {MainPage} from './pages/main/main';
import { FacilityInspService } from './providers/facility_insp_service';

declare const $: any;
const ANOM_USER = '未登录';

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;
  
  private rootPage: any;
  private userDisplayName: string = ANOM_USER;

  /**
   * app init */
  constructor(
    private platform: Platform,
    public menu: MenuController,
    private userService: UserService,
    private lookupService: LookupService,
    private alertController: AlertController,
    private facilityInspService: FacilityInspService,
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

  syncDownload() {
    // this.generateFacilityInspRecordList().then((result) => {
    //   this.facilityInspService.uploadFacilityRecords(result).subscribe((res1) => {
    //     this.facilityInspService.deleteAllFacilityInsps().then((res2) => {
    //        //删除完毕
    //     })
    //   }, (error) => {
    //     console.log(error);
    //   });
    // });

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
  }

  syncDelete() {
    this.facilityInspService.deleteAllFacilityInsps().then((result) => {
    }, (error) => {
    })
  }

  private saveFacilityRecordsToLocalDB(result) {
    this.facilityInspService.saveFacilityRecordsToLocalDB(result).then(() => {
      //成功！！
      let alert = this.alertController.create({
        subTitle: '数据同步成功！',
        buttons: ['确认']
      });
    })
  }

  private downloadFacilityRecords() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.downloadFacilityRecords().subscribe((result) => {
        resolve(result);
      },(error) => {
        reject(error);
      });
    });

    return promise;
  }

  private deleteAllFacilityInsps() {
    var promise = new Promise((resolve, reject) => {
      this.facilityInspService.deleteAllFacilityInsps().then((result) => {
        resolve();
      })
    });
    return promise;
  }

  private uploadFacilityRecords(facilityInspRecordList) {
    var promise = new Promise((resolve, reject) => {
      if(facilityInspRecordList.length != 0) {
        this.facilityInspService.uploadFacilityRecords(facilityInspRecordList).subscribe((result) => {
          resolve(result);
        },(error) => {
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
