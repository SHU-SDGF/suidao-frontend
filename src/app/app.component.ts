import { LoginComponent } from './pages/login/login.component';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Platform, ModalController, Nav, MenuController, AlertController, LoadingController, Events } from 'ionic-angular';
import { Splashscreen, StatusBar, BackgroundMode } from 'ionic-native';
import { UserService } from './providers/user-service';
import { LookupService } from './providers/lookup-service';
import { MainComponent } from './pages/main/main.component';
import { FacilityInspService } from './providers/facility-insp-service';
import { SyncUploadComponent } from './pages/main/sync_upload/sync-upload.component';
import { SyncDownloadComponent } from './pages/main/sync_download/sync-download.component';

declare const $: any;
declare const cordova;
const ANOM_USER = '未登录';

@Component({
  templateUrl: './app.component.html',
  styles: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;
  
  public rootPage: any;
  private userDisplayName: string = ANOM_USER;

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
      BackgroundMode.setDefaults({
        title: '隧道运维系统',
        text: '程序正在后台运行',
        silent: false
      });
      BackgroundMode.enable();
      platform.registerBackButtonAction(()=>{
        if(!this.nav.canGoBack()){
          return;
        }
        this.nav.pop();
      });
      lookupService.initDB();
      StatusBar.styleDefault();
      Splashscreen.hide();
      let _self = this;
      this.menu.enable(true, 'user-menu');
      
      userService.hasLoggedIn().then((loggedIn: boolean) => {
        
        if (loggedIn) {
          _self.nav.setRoot(MainComponent);
        } else {
          _self.nav.setRoot(LoginComponent);
        }
      });
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
      this.nav.setRoot(LoginComponent);
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
              this.nav.setRoot(LoginComponent);
            });
          }
        }
      ]
    });

    confirm.present();
  }

  public syncUpload() {
    this._modalCtrl.create(SyncUploadComponent).present();
  }

  public syncDownload(){
    this._modalCtrl.create(SyncDownloadComponent).present();
  }
}