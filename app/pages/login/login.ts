import { Component } from '@angular/core';

import { NavController, AlertController, LoadingController, LoadingOptions } from 'ionic-angular';

import { MainPage } from '../main/main';
import { UserService, Credentials} from '../../providers/user_service';


@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  credentials: Credentials = {userName: '', password: ''};
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userService: UserService, 
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  onLogin(form) {
    this.submitted = true;
    let _that = this;

    if (form.valid) {
      let options: LoadingOptions = {};
      let loader = this.loadingController.create({
        content: '登录中...',
        duration: 3000,
        dismissOnPageChange: true
      });
      loader.present();

      this.userService.login(this.credentials).then(
        res=>{
          _that.navCtrl.setRoot(MainPage);
        },
        error=>{
          let alert = _that.alertController.create({
            title: '创建',
            subTitle: '请检查用户名与密码是否正确',
            buttons: ['确定']
          });
          alert.present();
        }
      );
    }
  }
}
