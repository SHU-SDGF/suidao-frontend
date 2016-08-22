import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import {LoginPage} from './pages/login/login';
import * as _providers from './providers';
import { UserService } from './providers/user_service';
import {MainPage} from './pages/main/main';

let PouchDB = require("pouchdb");

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  private rootPage: any;


  constructor(
    private platform: Platform,
    public menu: MenuController,
    private userService: UserService
  ) {

    platform.ready().then(() => {

      var db = new PouchDB('birthday2', { adapter: 'websql'});
      StatusBar.styleDefault();
      Splashscreen.hide();
      let _self = this;
      this.menu.enable(true, 'user-menu');
      
      userService.hasLoggedIn().then(function(loggedIn: boolean){
        if(loggedIn){
          _self.nav.setRoot(MainPage);
        }else{
          _self.nav.setRoot(LoginPage);
        }
      })
    });
  }

  logout(){
    this.userService.logout();
    this.nav.setRoot(LoginPage);
  }
}

// load providers
var providersAr = [];
for(let p in _providers ){
  providersAr.push(_providers[p]);
}

ionicBootstrap(MyApp, providersAr);
