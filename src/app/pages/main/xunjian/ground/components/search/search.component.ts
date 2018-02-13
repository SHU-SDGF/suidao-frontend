import {
  Component, OnInit,
} from '@angular/core';
import {
  ModalController,
  ViewController, NavParams
} from 'ionic-angular';
import { LookupService, IActionStatus } from '../../../../../../providers/lookup-service';
import {ActivityInfoComponent} from '../../components/activity-info/activity-info.component';
import * as _ from 'lodash';
import { EnvironmentActivity } from '../../../../../../../models/EnvironmentActivity';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styles: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private actStatusList: Array<IActionStatus> = [];

  private searchArg: string = ''; // 搜索参数
  private searchedResults: Array<EnvironmentActivity>; // 搜索结果列表
  private shadowSearchedResults: Array<EnvironmentActivity>;
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

    this.searchedResults = this.params.get('environmentActivityList')
      .sort((r1, r2) => r1.inspDate > r2.inspDate ? -1 : 1);
    this.shadowSearchedResults = _.cloneDeep(this.searchedResults);
  }

  typeChange(item: {name: string, value: number}) {
    this.selectedType = item;
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }

  searchBarOnInput($event) {
    this.searchedResults = _.cloneDeep(this.shadowSearchedResults);
    this.searchedResults = this.searchedResults
      .filter(result => result.actName.includes(this.searchArg))
      .sort((r1, r2) => r1.inspDate > r2.inspDate ? -1 : 1);
  }

  showHistory(activityDetailObj) {
    let modal = this._modalCtrl.create(ActivityInfoComponent, {'activityDetail': activityDetailObj });
    modal.present();
  }
}