import {Component, ViewChild, OnInit} from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController, AlertController, Events} from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import {LoginPage} from './pages/login/login';
import * as _providers from './providers';
import { UserService } from './providers/user_service';
import { LookupService } from './providers/lookup_service';
import {MainPage} from './pages/main/main';

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
