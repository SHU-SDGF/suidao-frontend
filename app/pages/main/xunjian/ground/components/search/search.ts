import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events,
  ToastController, AlertController,
  ModalController, NavController,
  ViewController, NavParams
} from 'ionic-angular';
import {SelectPopover} from '../../../../../../shared/components/select-popover/select-popover';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/search/search.html',
  directives: [SelectPopover]
})
export class SearchPage implements OnInit, OnDestroy {

  private searchArg: string = ''; // 搜索参数
  private searchedResult: Array<any>; // 搜索结果列表
  private itemList = [
    { name: '环境巡检', value: 1 },
    { name: '周围环境', value: 1 }
  ];
  private selectedType = this.itemList[0]; //选择的种类
  
  constructor(private _viewCtrl: ViewController, private params: NavParams) {
    debugger;
    this.searchedResult = this.params.get('environmentActivityList');
    this.searchedResult = [
      {id: 12311, name: '环境活动002', date: '', lng: 0, lat: 0},
      {id: 12312, name: '环境活动001', date: '', lng: 0, lat: 0}
    ];
  }
  
  ngOnInit() {
    
  }

  ngOnDestroy() {
    
  }

  typeChange(item: {name: string, value: number}) {
    this.selectedType = item;
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }
}