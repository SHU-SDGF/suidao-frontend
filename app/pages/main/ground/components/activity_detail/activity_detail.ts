/// <reference path="../../../../../../typings/index.d.ts" />

import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../providers';
import {MapPoint} from '../../../../../shared/components/suidao-map/suidao-map';
import {LookupService} from '../../../../../providers';


@Component({
  templateUrl: './build/pages/main/ground/components/activity_detail/activity_detail.html'
})
export class ActivityDetailPage implements OnInit{
  
  private activityDetailObj: EnvironmentActivitySummary;

  private actStatusList: [{
    name: string,
    id: number
  }];

  private actTypes: [{
    name: string,
    id: number
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
      start_date: '', //起始日期
      end_date: '', //结束日期
      description: '', //活动描述
      longitude: point.lng, //经度
      latitude: point.lat //纬度
    };

    this._lookupService.getActionStatus().then((actStatusList:[{name: string, id: number}]) => {
      _self.actStatusList = actStatusList;
    });

    this._lookupService.getActTypes().then((actTypes:[{name: string, id: number}]) => {
      _self.actTypes = actTypes;
    });
  }

  createActivity() {
    this._actService.addNewEnvironmentActivity(this.activityDetailObj).then(() => {
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