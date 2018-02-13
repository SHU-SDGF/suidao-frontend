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
import { Events } from 'ionic-angular';

@Component({
  templateUrl: './disease-info.component.html',
  styles: ['./disease-info.component.scss']
})
export class DiseaseInfoComponent implements OnInit{
  
  selectedPage: string = 'detail';
  activityDetailObj: any;

  public diseaseFormObj: {
    diseaseNo?: string;
    mileage?: string;
    modelId?: string;
    diseaseDate?: number;
    displayModelName?: string;
    displayDiseaseDate?: string;
    displayDiseaseType?: string;
    detailTypeId?: number;
    diseaseDescription?: string;
    diseaseType?: number;
    area?: number;
    depth?: number;
    length?: number;
    width?: number;
    jointopen?: number;
    dislocation?: number;
    needRepair?: boolean;
    diseaseTypeId?: string;
  };

  private detailTypeList: any;
  private isEditing = false;
  private udpateUser = '';
  private diseaseHistoryList: FacilityInspDetail[];
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
    private _facilityInspService: FacilityInspService,
    private _event: Events
  ) { }

  public async ngOnInit() {
    try {
      this.diseaseFormObj = {};
      Object.assign(this.diseaseFormObj, this.params.get('disease'));
      this.diseaseFormObj.mileage = this.params.get('mileage');
      this.diseaseFormObj.displayDiseaseType = await this._lookupService.getNameBy(this.diseaseFormObj.diseaseTypeId, 'disease_types');
      this.diseaseFormObj.displayDiseaseDate = new Date(this.diseaseFormObj.diseaseDate).toISOString().slice(0, 10);
      this.diseaseFormObj.displayModelName = await this._lookupService.getNameBy(this.diseaseFormObj.modelId, 'model_names');
    
      this.udpateUser = (await this._userService.getUserInfo()).loginId;
      this.userList = await this._lookupService.getUserList();
      this.detailTypeList = await this._lookupService.getDetailTypesByDiseaseTypes(this.diseaseFormObj.diseaseTypeId)
    
      //获取最近更新的历史巡检记录
      let record = await this._facilityInspService.getLatestFacilityInspDetail(this.diseaseFormObj.diseaseNo);
      this.latestPhotos = record ? record.photos : [];
      this.diseaseHistoryList = await this._facilityInspService.getFacilityInspDetailByDiseaseNo(this.diseaseFormObj.diseaseNo);
      console.log(this.diseaseHistoryList);
    } catch (e) {
      console.log(e);
    }
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public edit() {
    this.isEditing = true;
  }

  public async update() {
    this.isEditing = false;
    let detail = new FacilityInspDetail(this.diseaseFormObj);
    let summary = await this._facilityInspService.findFacilityInspByDiseaseNo(this.diseaseFormObj.diseaseNo);
    detail.updateDate = new Date().getTime();
    detail.updateUser = this.udpateUser;
    detail.photos = this.photos;
    summary.diseaseDescription = this.diseaseFormObj.diseaseDescription || ' ';
    this.photos = [];
    if(summary.synFlg == 0) {
      summary.synFlg = 2;
    }
    try {
      await this._facilityInspService.updateFacilityInspSummary(summary);
      detail.synFlg = 1;
      //新增一条记录
      await this._facilityInspService.addNewFacilityInspDetail(detail, this.udpateUser);
      //更新历史记录
      this.diseaseHistoryList = await this._facilityInspService.getFacilityInspDetailByDiseaseNo(detail.diseaseNo);
      //获取最近更新的历史巡检记录
      let record = await this._facilityInspService.getLatestFacilityInspDetail(detail.diseaseNo);
      this.latestPhotos = record ? record.photos : [];
      let alert = this._alertController.create({
        message: '更新活动成功！',
        buttons: ['OK']
      });
      alert.present();
      this._event.publish('groundDataChange');
    } catch (e) {
      this.showErrorInfoModal();
    }
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
  public captureMedia(photos: IMediaContent[]){
    photos.forEach(photo => this.photos.unshift(photo));
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

  public showHistory(detail: FacilityInspDetail) {
    let modal = this._modelCtrl.create(DiseaseHistoryInfoComponent, {'diseaseDetailRecord': detail});
    modal.present();
  }
}
