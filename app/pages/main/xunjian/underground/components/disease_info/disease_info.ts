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
  private userList = [];

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
    this._lookupService.getNameBy(this.diseaseDetailObj.diseaseTypeId, 'disease_types').then((result) => {
      this.diseaseDetailObj["displayDiseaseType"] = result;
    });

    this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailObj.diseaseTypeId).then((result) => {
      this.detailTypeList = result;
    });

    this._lookupService.getNameBy(this.diseaseDetailObj.modelId, 'model_names').then((result) => {
      this.diseaseDetailObj["displayModelName"] = result;
    });

    this._userService.getUserInfo().then((userInfo) => {
      this.udpateUser = userInfo["loginId"];
    });

    this._lookupService.getUserList().then((result) => {
      this.userList = result;
    });

    // this.diseaseDetailObj["displayDiseaseType"] =  this._lookupService.getNameBy(this.diseaseDetailObj.diseaseTypeId, 'disease_types');
    // this.detailTypeList = this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseDetailObj.diseaseTypeId);
    // this.diseaseDetailObj["displayModelName"] = this._lookupService.getNameBy(this.diseaseDetailObj.modelId, 'model_names');
    this.diseaseDetailObj["displayDiseaseDate"] = new Date(this.diseaseDetailObj.diseaseDate).toISOString().slice(0,10);

    // this._userService.getUsername().then((result) => {
    //   this.udpateUser = result;
    // });

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
    if(this.diseaseDetailObj.synFlg == 0) {
      this.diseaseDetailObj.synFlg = 2;
    }
    this._facilityInspService.updateFacilityInsp(this.diseaseDetailObj).then((result) => {
      this.diseaseDetailObj["_rev"] = result["rev"];
      this.diseaseDetailObj.synFlg = 1;
      //新增一条记录
      this._facilityInspService.addNewFacilityInspDetail(this.diseaseDetailObj, this.udpateUser).then((result) => {

        //更新历史记录
        this._facilityInspService.getFacilityInspDetailByDiseaseNo(this.diseaseDetailObj.diseaseNo).then((result) => {
          this.diseaseHistoryList = result["docs"];
          let alert = this._alertController.create({
            message: '更新活动成功！',
            buttons: ['OK']
          });
          alert.present();
        }, (error) => {
          this.showErrorInfoModal();
        });
      }, (error) => {
        this.showErrorInfoModal();
      });
    }, (error) => {
      this.showErrorInfoModal();
    });
  }


  private showErrorInfoModal() {
    let alert = this._alertController.create({
      message: '更新活动成功！',
      buttons: ['OK']
    });
    alert.present();
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

  private displayDiseaseType(disease) {
    let detailTypeList = null;
    this._lookupService.getDetailTypesByDiseaseTypes(disease["diseaseTypeId"]).then((result) => {
      detailTypeList = result;
      let detailType = '';
      for(let index in detailTypeList) {
        if(detailTypeList[index]["id"] == disease["detailTypeId"]) {
          detailType = detailTypeList[index]["name"];
        }
      }
      this._lookupService.getNameBy(disease["diseaseTypeId"],'disease_types').then((result) => {
        return result + ':' + detailType;
      })
    })

    //let detailTypeList = this._lookupService.getDetailTypesByDiseaseTypes(disease["diseaseTypeId"]);
    
    //return this._lookupService.getNameBy(disease["diseaseTypeId"],'disease_types') + ':' + detailType;
  }

  private _convertRecorder(userId) {
    let userName = '';
    for(let index in this.userList) {
      if(this.userList[index]["id"] == userId) {
        userName = this.userList[index]["name"]; 
      }
    }
    return userName;
  }

  showHistory(index) {
    let modal = this._modelCtrl.create(DiseaseHistoryInfoPage, {'diseaseDetailRecord': this.diseaseHistoryList[index]});
    modal.present();
  }
}