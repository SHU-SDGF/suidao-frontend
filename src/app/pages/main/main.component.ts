import { ManyouComponent } from './manyou/manyou.component';
import { UserService } from '../../providers/user-service';
import { Component, ViewChild } from '@angular/core';
import { Nav, Events } from 'ionic-angular';
import { XunjianComponent } from './xunjian/xunjian.component';
import { TestPage } from './test/test';

@Component({
  templateUrl: './main.component.html',
  styles: ['./main.component.scss']
})
export class MainComponent{
  private username: string = '';
  public rootPages: Array<any> = [XunjianComponent, ManyouComponent, ManyouComponent, XunjianComponent];
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

  midBtnClick() {
    this.event.publish('md-btn-click');
  }

  onTabSelected(){
    console.log(arguments);
  }
}