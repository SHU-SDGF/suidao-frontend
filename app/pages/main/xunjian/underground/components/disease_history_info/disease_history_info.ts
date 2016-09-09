import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams} from 'ionic-angular';
import { EnvironmentActivityService } from '../../../../../../providers';
import {LookupService} from '../../../../../../providers';
import {AppUtils} from '../../../../../../shared/utils';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/disease_history_info/disease_history_info.html'
})
export class DiseaseHistoryInfoPage implements OnInit{
  
  diseaseDetailRecord: any;
  detailTypeList: any;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private _lookupService: LookupService
  ) {}

  ngOnInit() {
    let _self = this;
    this.diseaseDetailRecord = this.params.get('diseaseDetailRecord');

    this._lookupService.getNameBy(this.diseaseDetailRecord.diseaseTypeId, 'disease_types').then((result) => {
      this.diseaseDetailRecord["displayDiseaseType"] = result;
    });

    this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailRecord.diseaseTypeId).then((result) => {
      this.detailTypeList = result;
    });

    this._lookupService.getNameBy(this.diseaseDetailRecord.modelId, 'model_names').then((result) => {
      this.diseaseDetailRecord["displayModelName"] = result;
    });
    
    // this.diseaseDetailRecord["displayDiseaseType"] =  this._lookupService.getNameBy(this.diseaseDetailRecord.diseaseTypeId, 'disease_types');
    // this.detailTypeList = this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailRecord.diseaseTypeId);
    // this.diseaseDetailRecord["displayModelName"] = this._lookupService.getNameBy(this.diseaseDetailRecord.modelName, 'model_names');
    this.diseaseDetailRecord["displayDiseaseDate"] = new Date(this.diseaseDetailRecord.diseaseDate).toISOString().slice(0,10);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}