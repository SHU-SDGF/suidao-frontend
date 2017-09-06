import { ObservGraphComponent } from '../observ-graph/observ-graph.component';
import { DiseaseInfoComponent } from '../disease-info/disease-info.component';
import { LookupService } from '../../../../../../providers/lookup-service';
import { FacilityInspService } from '../../../../../../providers/facility-insp-service';
import { FacilityInspSummary } from '../../../../../../../models/FacilityInspSummary';
import {Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from 'ionic-angular';
import {
  NavController, ViewController,
  Events, ModalController, NavParams
} from 'ionic-angular';

@Component({
  templateUrl: './observ-info.component.html',
  styles: ['./observ-info.component.scss']
})
export class ObservInfoComponent implements OnInit, OnDestroy{

  private diseaseTypes = [
    {
      "icon": 'assets/imgs/liefeng.png',
      "name": "裂缝"
    },
    {
      "icon": 'assets/imgs/shenlou.png',
      "name": "渗漏"
    },
    {
      "icon": 'assets/imgs/sunhuai.png',
      "name": "缺损"
    },
    {
      "icon": 'assets/imgs/cuotai.png',
      "name": "错台"
    },
    {
      "icon": 'assets/imgs/xichu.png',
      "name": "张开"
    },
    {
      "icon": 'assets/imgs/jiefeng.png',
      "name": "腐蚀"
    }
  ];

  public selectedPage = 'disease';
  public scanMileage = '';
  public huanhao = '';
  public diseaseList: FacilityInspSummary[] = [];

  public isIOS() {
    const { platform } = this;
    return platform.is('ios');
  }

  constructor(
    private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _modalCtrl: ModalController,
    private _facilityInspService: FacilityInspService,
    private _lookupService: LookupService,
    private _event: Events,
    private _params: NavParams,
    private platform: Platform,
  ) { }

  async ngOnInit(){  
    this.huanhao = this._params.data.facilityInspInfo["mileage"];
    await this._updateFacilityInspList();
    this.diseaseList = this._params.data.facilityInspInfo["facilityInsp"];
    console.log('in modal class');
  }

  viewDisease(disease){
    let modal = this._modalCtrl.create(DiseaseInfoComponent,{disease: disease, mileage: this.huanhao});
    modal.present();
    modal.onDidDismiss(() => {
      this._updateFacilityInspList();
    });
  }

  public viewGraph() {
    let modal = this._modalCtrl.create(ObservGraphComponent, {'existingDiseaseList': this.diseaseList, mileage: this.huanhao});
    modal.present();
    modal.onDidDismiss(() => {
      this._updateFacilityInspList();
    });
  }

  public openCamera() {
    let info = this.diseaseList.map((d) => {
      let icon = this.getInfoByDiseaseType(d.diseaseTypeId).icon;
      icon = icon.substr(icon.lastIndexOf('/')+ 1, icon.lastIndexOf('.') - icon.lastIndexOf('/') - 1);;
      return {
        diseaseNo: d.diseaseNo,
        icon: icon,
        left: d.longitude / 296,
        top: 1 - d.latitude / 187
      };
    });
    window['plugins'].arcamera.ArCamera.prototype.show(info, (data) => {
      let disease = this.diseaseList[parseInt(data)];
      this.viewDisease(disease);
    });
  }

  dismiss(){
    this._navCtrl.pop();
    //this._viewCtrl.dismiss();
  }

  ngOnDestroy(){
    
  }

  private async _updateFacilityInspList() {
    let attrOption = await this._lookupService.getTunnelOption();
    attrOption.mileage = this.huanhao;
    this.diseaseList = await this._facilityInspService.getFacilityInspDetailsListByAttrs(attrOption);
  }

  public getInfoByDiseaseType(diseaseType) {
    var diseaseTypeIndex = diseaseType[1] - 1;
    return this.diseaseTypes[diseaseTypeIndex];
  }
}