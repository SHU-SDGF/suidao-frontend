import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { UserService, Credentials } from '../../providers/user_service';


@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  credentials: Credentials = {userName: '', password: ''};
  submitted = false;

  constructor(public navCtrl: NavController, public userService: UserService, private alertController: AlertController) { }

  onLogin(form) {
    this.submitted = true;
    let _that = this;

    if (form.valid) {
      this.userService.login(this.credentials).then(
        res=>{
          _that.navCtrl.push(TabsPage);
        },
        error=>{
          let alert = _that.alertController.create({
            title: 'New Friend!',
            subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }
  }
}
