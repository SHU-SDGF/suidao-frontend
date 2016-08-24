/// <reference path="../../../../../../typings/index.d.ts" />

import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { EnvironmentActivity, EnvironmentActivityService, EnvironmentActivitySummary } from '../../../../../providers';
import {LookupService} from '../../../../../providers';


@Component({
  selector: 'map-presentation',
  templateUrl: 'build/pages/main/ground/components/activity_detail/activity_detail.html'
})
export class ActivityDetailPage implements OnInit{
  
  private activityDetailObj: EnvironmentActivity;

  private actStatusList: [{
    name: string,
    id: number
  }];
  private actTypes: [{
    name: string,
    id: number
  }];

  constructor(public viewCtrl: ViewController,
    private activityDetail: EnvironmentActivityService,
    private lookupService: LookupService
  ) { }

  ngOnInit() {
    let _self = this;
    this.activityDetailObj = {
      act_no: null, //活动编码
      insp_date: null, //巡检日期
      end_date: null, //更新日时
      act_status: null, //活动状态 
      act_type: 1, //活动类型
      description: '', // 描述
      create_user: '', //作成者
      update_user: '', // 更新者
      photo: '', // 图片
      audio: '', // 音频
      video: '', // 视频
      recorder: 'string', //记录人
      create_date: 'any', //作成日时
      update_date: 'any', //更新日时
    };

    this.lookupService.getActionStatus().then((actStatusList:[{name: string, id: number}]) => {
      _self.actStatusList = actStatusList;
    });
    this.lookupService.getActTypes().then((actTypes:[{name: string, id: number}]) => {
      _self.actTypes = actTypes;
    });
  }

  createActivity() {
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}