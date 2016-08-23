import { Component, ViewChild } from '@angular/core';
import {UserService} from '../../providers/user_service';
import {Nav, Events} from 'ionic-angular';
import {GroundPage} from './ground/ground';
import {ManyouPage} from './manyou/manyou';
import {TestPage} from './test/test';

@Component({
  templateUrl: './build/pages/main/main.html'
})
export class MainPage{
  private username: string = '';
  private rootPages: Array<any> = [GroundPage, ManyouPage, TestPage, GroundPage];
  //private rootPage: any = GroundPage;
  @ViewChild(Nav) nav: Nav;

  constructor(private userService: UserService, private event: Events){
    let _that = this;

    userService.getUsername().then((username)=>{
      _that.username = username;
    });
  }

  changeTab(component: any) {
    this.event.publish('change-tab', component);
  }

  onTabSelected(){
    console.log(arguments);
  }
}