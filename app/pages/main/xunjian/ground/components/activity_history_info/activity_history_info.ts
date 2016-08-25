import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_history_info/activity_history_info.html'
})
export class ActivityHistoryInfoPage implements OnInit{
  
  activityDetailObj: EnvironmentActivitySummary;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams) { }

  ngOnInit() {
    this.activityDetailObj = this.params.get('activityDetail');
    this.activityDetailObj = {
      act_name: '', //活动名称
      description: '', //活动描述
      longitude: 0, //经度
      latitude: 0, //纬度
      act_status: '',
      act_type: '',
      recorder: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}