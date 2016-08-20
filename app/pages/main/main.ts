import { Component, ViewChild } from '@angular/core';
import {UserService} from '../../providers/user_service';
import {Nav, Events} from 'ionic-angular';
import {HomePage} from '../home/home';
import {ContactPage} from '../contact/contact';
import {AboutPage} from '../about/about';

import {GroundPage} from './ground/ground';

@Component({
  templateUrl: './build/pages/main/main.html'
})
export class MainPage{
  private username: string = '';
  private rootPages: Array<any> = [GroundPage, HomePage, ContactPage, AboutPage];
  //private rootPage: any = GroundPage;
  @ViewChild(Nav) nav: Nav;

  constructor(private userService: UserService){
    let _that = this;

    userService.getUsername().then((username)=>{
      _that.username = username;
    });
  }

  onTabSelected(){
    console.log(arguments);
  }
}