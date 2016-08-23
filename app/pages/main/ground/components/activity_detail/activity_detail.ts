/// <reference path="../../../../../../typings/index.d.ts" />

import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { EnvironmentActivity } from '../../../../../providers';


@Component({
  selector: 'map-presentation',
  templateUrl: 'build/pages/main/ground/components/activity_detail/activity_detail.html'
})
export class ActivityDetailPage{
  
  private activityDetailObj: any = {};

  constructor(public viewCtrl: ViewController,
    private activityDetail: EnvironmentActivity) { }
  


  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}