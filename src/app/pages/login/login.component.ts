import { Component } from '@angular/core';

import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { MainComponent } from '../main/main.component';
import { UserService, Credentials} from '../../providers/user-service';
import { LookupService } from '../../providers/lookup-service';


@Component({
  templateUrl: './login.component.html',
  styles: ['./login.component.scss']
})
export class LoginComponent {
  credentials: Credentials = {userName: '', password: ''};
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userService: UserService,
    public lookupService: LookupService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  onLogin(form) {
    this.submitted = true;
    let _that = this;

    if (form.valid) {
      let loader = this.loadingController.create({
        content: '登录中...',
        dismissOnPageChange: true
      });
      loader.present().then(()=>{
        this.userService.login(this.credentials).then(
          res => {
            this.lookupService.getWholeLookupTable();
            loader.dismiss().then(() => {
              _that.navCtrl.setRoot(MainComponent);
            });
          },
          error => {
            loader.dismiss().then(() => {
              let alert = _that.alertController.create({
                title: '创建',
                subTitle: '请检查用户名与密码是否正确',
                buttons: ['确定']
              });
              alert.present();
            });
          }
        );
      });
    }
  }
}
