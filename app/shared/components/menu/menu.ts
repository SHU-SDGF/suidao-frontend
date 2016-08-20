import { Component, ViewChild } from '@angular/core';
import {UserService} from '../../../providers/user_service';

@Component({
  templateUrl: 'build/shared/components/menu/menu.html'
})
class UserMenu{
  username: string = '';

  constructor(private userService: UserService){
    let _that = this;
    
<<<<<<< HEAD

=======
>>>>>>> 22144d6f90b556be6485dc025149d3c288bb7db2
    userService.getUsername().then((username)=>{
      _that.username = username;
    });
  }
}