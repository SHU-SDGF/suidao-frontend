import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events,
  ToastController, AlertController,
  ModalController, NavController,
  ViewController, NavParams
} from 'ionic-angular';
import {SelectPopover} from '../../../../../../shared/components/select-popover/select-popover';
import {LookupService} from '../../../../../../providers';
import {ActivityInfoPage} from '../../components/activity_info/activity_info';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/search/search.html',
  directives: [SelectPopover]
})
export class SearchPage implements OnInit, OnDestroy {

  private actStatusList: [{
    name: string,
    order: number
  }];

  private actTypesList: [{
    name: string,
    order: number
  }];

  private searchArg: string = ''; // 搜索参数
  private searchedResults: Array<any>; // 搜索结果列表
  private itemList = [
    { name: '环境巡检', value: 1 },
    { name: '周围环境', value: 1 }
  ];
  private selectedType = this.itemList[0]; //选择的种类

  constructor(private _viewCtrl: ViewController, private params: NavParams, private _lookupService: LookupService,private  _modalCtrl: ModalController) {
  }
  
  ngOnInit() {
    let _self = this;
    this._lookupService.getActionStatus().then((actStatusList:[{name: string, order: number}]) => {
      _self.actStatusList = actStatusList;
    });

    this.searchedResults = this.params.get('environmentActivityList');
  }

  ngOnDestroy() {
    
  }

  typeChange(item: {name: string, value: number}) {
    debugger;
    this.selectedType = item;
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }

  showHistory(activityDetailObj) {
    let modal = this._modalCtrl.create(ActivityInfoPage, {'activityDetail': activityDetailObj });
    modal.present(modal);
    modal.onDidDismiss(() => {
    });
  }

  private _convertDate(datetime) {
    let date = new Date(datetime)
    return date.getFullYear() + '-0' + (date.getMonth() + 1) + '-0' + (date.getDay() + 1)
  }

  private _getLookUpValue(list, order){
    let value = '';
    for(let el in list){
      if(list[el]["order"]  == order){
        value = list[el]["name"];
      }
    }
    return value;
  }
}