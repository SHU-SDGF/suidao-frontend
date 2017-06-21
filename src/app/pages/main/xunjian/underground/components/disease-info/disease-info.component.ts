import { FacilityInspService } from '../../../../../../providers/facility-insp-service';
import { EnvironmentActivityService } from '../../../../../../providers/environment-activity-service';
import { UserService } from '../../../../../../providers/user-service';
import { LookupService } from '../../../../../../providers/lookup-service';
import { FacilityInspDetail } from '../../../../../../../models/FacilityInspDetail';
import {
  Component, OnInit,
} from '@angular/core';
import {
  ViewController, AlertController,
  NavParams, ModalController, LoadingController
} from 'ionic-angular';
import { IMediaContent } from '../../../../../../../models/MediaContent';
import { DiseaseHistoryInfoComponent } from '../disease-history-info/disease-history-info.component';

@Component({
  templateUrl: './disease-info.component.html',
  styles: ['./disease-info.component.scss']
})
export class DiseaseInfoComponent implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: any;

  private diseaseDetailObj: any;
  private detailTypeList: any;
  private isEditing = false;
  private udpateUser = '';
  private diseaseHistoryList: FacilityInspDetail;
  private userList = [];
  private photos: Array<IMediaContent> = [];
  private latestPhotos: Array<IMediaContent> = [];


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
    this.diseaseDetailObj = this.params.get('disease');
    this.diseaseDetailObj.mileage = this.params.get('mileage');
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

    //获取最近更新的历史巡检记录
    this._facilityInspService.getLatestFacilityInspDetail(this.diseaseDetailObj.diseaseNo).then((result) => {
      if(result["docs"].length > 0) {
        let latestFacilityInspDetails = result["docs"][result["docs"].length - 1];
        console.log("***************2");
        console.log(latestFacilityInspDetails);
        console.log("xxxxxxxxxx");
        console.log(latestFacilityInspDetails["photos"]);
        this.latestPhotos = latestFacilityInspDetails["photos"];
      }
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
    this.diseaseDetailObj.photos = this.photos;
    this.diseaseDetailObj.diseaseDescription = this.diseaseDetailObj.diseaseDescription || ' ';
    this.photos = [];
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
          //获取最近更新的历史巡检记录
          this._facilityInspService.getLatestFacilityInspDetail(this.diseaseDetailObj.diseaseNo).then((result) => {
            if(result["docs"].length > 0) {
              let latestFacilityInspDetails = result["docs"][result["docs"].length - 1];
              console.log(latestFacilityInspDetails["photos"]);
              this.latestPhotos = latestFacilityInspDetails["photos"];
            }
            let alert = this._alertController.create({
              message: '更新活动成功！',
              buttons: ['OK']
            });
            alert.present();
          });
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

  /**
   * 获取多媒体文件
   */
  captureMedia(photo: IMediaContent){
    this.photos.unshift(photo);
  }
  
  public convertDate(date) {
    return new Date(date).toISOString().slice(0,10);
  }

  public convertRecorder(userId) {
    let userName = '';
    for(let index in this.userList) {
      if(this.userList[index]["id"] == userId) {
        userName = this.userList[index]["name"]; 
      }
    }
    return userName;
  }

  showHistory(index) {
    let modal = this._modelCtrl.create(DiseaseHistoryInfoComponent, {'diseaseDetailRecord': this.diseaseHistoryList[index]});
    modal.present();
  }
}