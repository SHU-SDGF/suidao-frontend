import {Component, OnInit,
  ViewChild} from '@angular/core';
import {ViewController, AlertController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {EnvironmentActivityService, UserService } from '../../../../../../providers';
import {DiseaseHistoryInfoPage} from '../disease_history_info/disease_history_info';
import {LookupService, FacilityInspService} from '../../../../../../providers';
import {AppUtils} from '../../../../../../shared/utils';
import {FacilityInspSummary} from  '../../../../../../models/FacilityInspSummary';
import {FacilityInspDetail} from '../../../../../../models/FacilityInspDetail';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/disease_info/disease_info.html',
  pipes: [AppUtils.DatePipe]
})
export class DiseaseInfoPage implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: any;

  private actStatusList: [{
    name: string,
    order: number
  }];

  private actTypes: [{
    name: string,
    order: number
  }];

  private diseaseDetailObj: FacilityInspSummary;
  private detailTypeList: any;
  private diseaseTypeList: any;
  private isEditing = false;
  private udpateUser = '';
  private diseaseHistoryList: FacilityInspDetail;
  private environmentActivityList: any = [];

  constructor(
    private viewCtrl: ViewController,
    private _modelCtrl: ModalController,
    private _lookupService: LookupService,
    private _alertController: AlertController,
    private _userService: UserService,
    private _environmentActivityService: EnvironmentActivityService,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private _facilityInspService: FacilityInspService
  ) { }

  ngOnInit() {
    let _self = this;
    this.diseaseDetailObj = this.params.get('disease');
    this.diseaseDetailObj["displayDiseaseType"] =  this._lookupService.getNameBy(this.diseaseDetailObj.diseaseType, 'disease_types');
    this.detailTypeList = this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailObj.diseaseType);
    this.diseaseDetailObj["displayModelName"] = this._lookupService.getNameBy(this.diseaseDetailObj.modelName, 'model_names');
    this.diseaseDetailObj["displayDiseaseDate"] = new Date(this.diseaseDetailObj.diseaseDate).toISOString().slice(0,10);

    this._userService.getUsername().then((result) => {
      this.udpateUser = result;
    });

    this._facilityInspService.getFacilityInspDetailByDiseaseNo(this.diseaseDetailObj.diseaseNo).then((result) => {
      this.diseaseHistoryList = result["docs"];
    }, (error) => {
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  edit() {
    this.isEditing = true;
  }

  update() {
    this.isEditing = false;
    this.diseaseDetailObj.updateDate = new Date().getTime();
    this.diseaseDetailObj.updateUser = this.udpateUser;
    this._facilityInspService.updateFacilityInsp(this.diseaseDetailObj).then((result) => {
      this.diseaseDetailObj["_rev"] = result["rev"];
      //新增一条记录
      this._facilityInspService.addNewFacilityInspDetail(this.diseaseDetailObj).then((result) => {
        //更新历史记录
        this._facilityInspService.getFacilityInspDetailByDiseaseNo(this.diseaseDetailObj.diseaseNo).then((result) => {
          this.diseaseHistoryList = result["docs"];
        }, (error) => {
        });
      }, (error) => {
      });
    }, (error) => {
    });
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

  private _convertDate(date) {
    return new Date(date).toISOString().slice(0,10);
  }

  showHistory(index) {
    let modal = this._modelCtrl.create(DiseaseHistoryInfoPage, {'diseaseDetailRecord': this.diseaseHistoryList[index]});
    modal.present();
  }
}