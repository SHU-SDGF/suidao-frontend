import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivityService} from '../../../../../../providers';
import {LookupService, IActionStatus, IActionType} from '../../../../../../providers/lookup_service';
import {EnvironmentActivitySummary} from '../../../../../../models/EnvironmentActivitySummary';
import {EnvironmentActivity} from '../../../../../../models/EnvironmentActivity';
import {AppUtils, DatePipe, OptionPipe} from '../../../../../../shared/utils';
import {MediaViewer} from '../../../../../../shared/components/media-viewer/media-viewer';
import {StatusPicker } from '../../../../../../shared/components/status-picker/status-picker';
import {IMediaContent} from '../../../../../../models/MediaContent';


@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/activity_history_info/activity_history_info.html',
  pipes: [DatePipe, OptionPipe],
  directives: [MediaViewer, StatusPicker]
})
export class ActivityHistoryInfoPage implements OnInit{
  private actStatusList: Array<IActionStatus> = [];
  private actTypes: Array<IActionType> = [];
  private activityDetailObj: any;
  private medias: Array<IMediaContent>;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private _lookupService: LookupService
  ) {}

  ngOnInit() {
    this._lookupService.getActionStatus().then((actStatusList) => {
      this.actStatusList = actStatusList;
    });

    this._lookupService.getActTypes().then((actTypes) => {
      this.actTypes = actTypes;
    });

    let activityName = this.params.get('activityName');
    let activityParams = this.params.get('activityDetail');
    this.activityDetailObj = {
      actName: activityName,
      inspDate: activityParams["inspDate"],
      description: activityParams["description"], //活动描述
      actStatus: parseInt(activityParams["actStatus"]),
      recorder: activityParams["recorder"],
      photo: activityParams["photo"],
      audio: activityParams["audio"],
      video: activityParams["video"],
      actNo: activityParams["actNo"],
      actType: activityParams['actType']
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}