/// <reference path="../../../../../../../typings/index.d.ts" />

import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../../providers';
import {MapPoint} from '../../../../../../shared/components/suidao-map/suidao-map';
import {LookupService} from '../../../../../../providers';


@Component({
  selector: 'activity-detail',
  templateUrl: './build/pages/main/xunjian/ground/components/activity_detail/activity_detail.html'
})
export class ActivityDetailPage implements OnInit{
  
  private activityDetailObj: EnvironmentActivitySummary;

  private actStatusList: [{
    name: string,
    order: number
  }];

  private actTypes: [{
    name: string,
    order: number
  }];

  constructor(public viewCtrl: ViewController,
    private _activityDetail: EnvironmentActivityService,
    private _lookupService: LookupService,
    private _actService: EnvironmentActivityService,
    private _alertCtrl: AlertController,
    private params: NavParams
  ) {}

  ngOnInit() {
    let _self = this;
    let point: MapPoint = this.params.get('point');
    this.activityDetailObj = {
      act_name: '', //活动名称
      description: '', //活动描述
      longitude: point.lng, //经度
      latitude: point.lat, //纬度
      act_status: '',
      act_type: '',
      recorder: ''
    };

    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
    });

    this._lookupService.getActTypes().then((actTypes:[{name: string, order: number}]) => {
      _self.actTypes = actTypes;
    });
  }

  createActivity() {
    let activityObj = {
      environmentActitivitySummary: {
        actName: this.activityDetailObj.act_name,
        description: this.activityDetailObj.description,
        longtitude: this.activityDetailObj.longitude,
        latitude: this.activityDetailObj.latitude,
        startDate: new Date(this.activityDetailObj.start_date).getTime(),
        endDate: new Date(this.activityDetailObj.end_date).getTime()
      },
      environmentActivity: {
        actType: this.activityDetailObj.act_type,
        actStatus: this.activityDetailObj.act_status,
        description: this.activityDetailObj.description,
        recorder: this.activityDetailObj.recorder,
        inspDate: new Date()
      }
    }

    this._actService.addNewEnvironmentActivitySummary(activityObj).then(() => {
      this.viewCtrl.dismiss(this.activityDetailObj);
    }, (error) => {
      let alert = this._alertCtrl.create({
        title: '出错啦！',
        message: '创建活动未能成功！请重新尝试！'
      });
      alert.present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}