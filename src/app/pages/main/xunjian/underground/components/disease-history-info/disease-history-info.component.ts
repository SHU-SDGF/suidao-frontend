import { LookupService } from '../../../../../../providers/lookup-service';
import {
  Component, OnInit,
} from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: './disease-history-info.component.html',
  styles: ['./disease-history-info.component.scss']
})
export class DiseaseHistoryInfoComponent implements OnInit{
  
  diseaseDetailRecord: any;
  detailTypeList: any;
  photos: any;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private _lookupService: LookupService
  ) {}

  ngOnInit() {
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

    this._lookupService.getNameBy(this.diseaseDetailRecord.recorder, 'user_list').then((name) => {
      this.diseaseDetailRecord["displayRecorder"] = name;
    });

    this.photos = this.diseaseDetailRecord["photos"];
    
    // this.diseaseDetailRecord["displayDiseaseType"] =  this._lookupService.getNameBy(this.diseaseDetailRecord.diseaseTypeId, 'disease_types');
    // this.detailTypeList = this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailRecord.diseaseTypeId);
    // this.diseaseDetailRecord["displayModelName"] = this._lookupService.getNameBy(this.diseaseDetailRecord.modelName, 'model_names');
    this.diseaseDetailRecord["displayDiseaseDate"] = new Date(this.diseaseDetailRecord.diseaseDate).toISOString().slice(0,10);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}