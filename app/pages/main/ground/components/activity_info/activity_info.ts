import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';


@Component({
  templateUrl: './build/pages/main/ground/components/activity_info/activity_info.html'
})
export class ActivityInfoPage implements OnInit{

  constructor(private viewCtrl: ViewController){}

  ngOnInit(){

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}