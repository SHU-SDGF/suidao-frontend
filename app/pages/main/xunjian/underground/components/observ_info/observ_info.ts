import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {NavController, ViewController, 
  AlertController, ModalController} from 'ionic-angular';
import {ObservSavePage} from '../observ_save/observ_save';
import {AppUtils} from '../../../../../../shared/utils';
import {SelectPopover} from  '../../../../../../shared/components/select-popover/select-popover';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_info/observ_info.html',
  pipes: [AppUtils.DatePipe],
  directives: [SelectPopover]
})
export class ObservInfoPage implements OnInit{

  private huanhaoList = [{
    number: 49,
    name: 49,
  },{
    number: 50,
    name: 50,
  },{
    number: 51,
    name: 51,
  },];

  private huanhao = this.huanhaoList[1];

  private diseaseList = [{
    icon: 'build/imgs/cuotai.png',
    no: '24734523123',
    date: (new Date).getTime(),
    name: '错台'
  },{
    icon: 'build/imgs/shenlou.png',
    no: '24734523123',
    date: (new Date).getTime(),
    name: '渗漏'
  },{
    icon: 'build/imgs/jiefeng.png',
    no: '24734523123',
    date: (new Date).getTime(),
    name: '接缝'
  },{
    icon: 'build/imgs/luoshuang.png',
    no: '24734523123',
    date: (new Date).getTime(),
    name: '螺栓'
  }];

  constructor(){

  }

  ngOnInit(){

  }

}