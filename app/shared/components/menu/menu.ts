import { Component, ViewChild } from '@angular/core';
import {UserService} from '../../../providers/user_service';

@Component({
  templateUrl: 'build/shared/components/menu/menu.html'
})
class UserMenu{
  username: string = '';

  constructor(private userService: UserService){
    let _that = this;
    

    userService.getUsername().then((username)=>{
      _that.username = username;
    });
  }
}