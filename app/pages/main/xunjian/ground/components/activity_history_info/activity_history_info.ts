import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivityService} from '../../../../../../providers';
import {LookupService, IActionStatus, IActionType} from '../../../../../../providers/lookup_service';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {AppUtils, DatePipe} from '../../../../../../shared/utils';


@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_history_info/activity_history_info.html',
  pipes: [DatePipe]
})
export class ActivityHistoryInfoPage implements OnInit{
  private actStatusList: Array<IActionStatus>;

  private actTypesList: Array<IActionType>;
  activityDetailObj: any;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private _lookupService: LookupService
  ) {}

  ngOnInit() {
    let _self = this;
    this._lookupService.getActionStatus().then((actStatusList) => {
      _self.actStatusList = actStatusList;
    });

    this._lookupService.getActTypes().then((actTypesList) => {
      _self.actTypesList = actTypesList;
    });

    let activityName = this.params.get('activityName');
    let activityParams = this.params.get('activityDetail');
    this.activityDetailObj = {
      actName: activityName,
      inspDate: activityParams["inspDate"],
      endDate: activityParams["endDate"],
      description: activityParams["description"], //活动描述
      actStatus: activityParams["actStatus"],
      recorder: activityParams["recorder"],
      photo: activityParams["photo"],
      audio: activityParams["audio"],
      video: activityParams["video"],
      actNo: activityParams["actNo"]
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}