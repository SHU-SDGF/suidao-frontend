import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events,
  ToastController, AlertController,
  ModalController, NavController,
  ViewController
} from 'ionic-angular';
import {SelectPopover} from '../../../../../../shared/components/select-popover/select-popover';

@Component({
  templateUrl: './build/pages/main/xunjian/ground/components/search/search.html',
  directives: [SelectPopover]
})
export class SearchPage implements OnInit, OnDestroy {

  private searchArg: string = '';
  private itemList = [
    { name: '环境巡检', value: 1 },
    { name: '周围环境', value: 1 }
  ];
  private selectedType = this.itemList[0];
  
  constructor(private _viewCtrl: ViewController) {
    
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