import { FacilityInspSummary } from '../../../../../../../models/FacilityInspSummary';
import { FacilityInspService } from '../../../../../../providers/facility-insp-service';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import * as _ from 'lodash';


@Component({
  selector: 'huanhao-cmp',
  templateUrl: './huanhao-search.component.html',
  styles: ['./huanhao-search.component.scss'],
})
export class HuanhaoSearchComponent {

  public huanhaoList: {
    mileage: string;
    facilityInsp: FacilityInspSummary[];
  }[] = [];

  public selectedHuanhao: {
    mileage: string;
    facilityInsp: FacilityInspSummary[];
  }[] = [];

  constructor(
    public viewCtrl: ViewController,
    private _facilityInspService: FacilityInspService,
  ) { 
    this.loadDate();
  }

  private async loadDate() {
    let result = await this._facilityInspService.getAllFacilityInspSummaries();
    let g = _.groupBy(result, 'mileage');
    for (let index in g) {
      let t = { mileage: index, facilityInsp: g[index] };
      this.huanhaoList.push(t);
    }
    this.onInput();
  }

  public done(facilityInsp) {
    this.viewCtrl.dismiss(facilityInsp);
  }
  
  public dismiss() { 
    this.viewCtrl.dismiss(false);
  }

  public onInput(value = null) {
    if (value) {
      this.selectedHuanhao = this.huanhaoList.filter(h => h.mileage.indexOf(value) > -1);
    } else {
      this.selectedHuanhao = this.huanhaoList;
    }
  }
}
