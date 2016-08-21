import { Component, ViewChild } from '@angular/core';
import {UserService} from '../../providers/user_service';
import {Nav, Events} from 'ionic-angular';
import {GroundPage} from './ground/ground';

@Component({
  templateUrl: './build/pages/main/main.html'
})
export class MainPage{
  private username: string = '';
  private rootPages: Array<any> = [GroundPage];
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