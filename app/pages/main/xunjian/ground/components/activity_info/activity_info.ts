import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {ActivityHistoryInfoPage} from '../activity_history_info/activity_history_info';

@Component({
  templateUrl: './build/pages/main/ground/components/activity_info/activity_info.html'
})
export class ActivityInfoPage implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: EnvironmentActivitySummary;

  constructor(
    private viewCtrl: ViewController,
    private _modelCtrl: ModalController,
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

  showHistory() {
    let modal = this._modelCtrl.create(ActivityHistoryInfoPage);
    modal.present();
  }
}