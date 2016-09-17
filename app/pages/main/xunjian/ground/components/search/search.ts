import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events,
  ToastController, AlertController,
  ModalController, NavController,
  ViewController, NavParams
} from 'ionic-angular';
import {SelectPopover} from '../../../../../../shared/components/select-popover/select-popover';
import {LookupService, IActionStatus, IOption} from '../../../../../../providers/lookup_service';
import {ActivityInfoPage} from '../../components/activity_info/activity_info';
import {AppUtils, OptionPipe, DatePipe, StatusPipe} from '../../../../../../shared/utils';
import * as  _ from 'lodash';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/search/search.html',
  directives: [SelectPopover],
  pipes: [OptionPipe, DatePipe, StatusPipe]
})
export class SearchPage implements OnInit, OnDestroy {

  private actStatusList: Array<IActionStatus> = [];
  private actTypesList: Array<IOption> = [];

  private searchArg: string = ''; // 搜索参数
  private searchedResults: Array<any>; // 搜索结果列表
  private shadowSearchedResults: Array<any>;
  private itemList = [
    { name: '环境巡检', value: 1 },
    { name: '周围环境', value: 1 }
  ];
  
  private selectedType = this.itemList[0]; //选择的种类

  constructor(private _viewCtrl: ViewController, private params: NavParams, private _lookupService: LookupService,private  _modalCtrl: ModalController) {
  }
  
  ngOnInit() {
    let _self = this;
    this._lookupService.getActionStatus().then((actStatusList) => {
      _self.actStatusList = actStatusList;
    });

    this.searchedResults = this.params.get('environmentActivityList');
    this.shadowSearchedResults = _.cloneDeep(this.searchedResults);
  }

  ngOnDestroy() {
    
  }

  typeChange(item: {name: string, value: number}) {
    this.selectedType = item;
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }

  searchBarOnInput($event) {
    this.searchedResults = _.cloneDeep(this.shadowSearchedResults);
    this.searchedResults = _.filter(this.searchedResults, ((result) => {
      return result.actName.includes(this.searchArg)
    }));
  }

  showHistory(activityDetailObj) {
    let modal = this._modalCtrl.create(ActivityInfoPage, {'activityDetail': activityDetailObj });
    modal.present(modal);
    modal.onDidDismiss(() => {
    });
  }
}