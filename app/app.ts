import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import {LoginPage} from './pages/login/login';
import * as _providers from './providers';


@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  private rootPage: any;

  constructor(
    private platform: Platform,
    public menu: MenuController
  ) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.nav.setRoot(LoginPage);
      this.menu.enable(true, 'user-menu');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
    
  }
}
var providersAr = [];
for(let p in _providers ){
  providersAr.push(_providers[p]);
}

ionicBootstrap(MyApp, providersAr);
