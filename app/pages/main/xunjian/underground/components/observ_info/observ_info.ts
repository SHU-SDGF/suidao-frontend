import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {NavController, ViewController, 
  AlertController, ModalController, NavParams} from 'ionic-angular';
import {ObservSavePage} from '../observ_save/observ_save';
import {AppUtils} from '../../../../../../shared/utils';
import {SelectPopover} from  '../../../../../../shared/components/select-popover/select-popover';
import {ObservGraphPage} from '../observ_graph/observ_graph';
import {FacilityInspSummary} from  '../../../../../../models/FacilityInspSummary';
import {DiseaseInfoPage} from '../disease_info/disease_info';
import {FacilityInspService} from '../../../../../../providers/facility_insp_service';

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
  }];

  private diseaseTypes = [
    {
      "icon": 'build/imgs/liefeng.png',
      "name": "裂缝"
    },
    {
      "icon": 'build/imgs/shenlou.png',
      "name": "渗漏"
    },
    {
      "icon": 'build/imgs/sunhuai.png',
      "name": "缺损"
    },
    {
      "icon": 'build/imgs/cuotai.png',
      "name": "错台"
    },
    {
      "icon": 'build/imgs/xichu.png',
      "name": "张开"
    },
    {
      "icon": 'build/imgs/jiefent.png',
      "name": "腐蚀"
    }
  ];

  private selectedPage = 'disease';
  private scanMileage = '';

  private huanhao = '';

  private diseaseList: FacilityInspSummary[] = [];

  constructor(
    private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _modalCtrl: ModalController,
    private _facilityInspService: FacilityInspService,
    private _params: NavParams){
  }

  ngOnInit(){  
    this.huanhao = this._params.data.facilityInspInfo["mileage"];
    this.diseaseList = this._params.data.facilityInspInfo["facilityInsp"];
  }

  viewDisease(disease){
    let modal = this._modalCtrl.create(DiseaseInfoPage,{disease: disease});
    modal.present();
    modal.onDidDismiss(() => {
      this._updateFacilityInspList();
    });
  }

  viewGraph() {
    let modal = this._modalCtrl.create(ObservGraphPage, {'existingDiseaseList': this.diseaseList});
    modal.present();
    modal.onDidDismiss(() => {
      this._updateFacilityInspList();
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  private _updateFacilityInspList() {
    var attrOption = JSON.parse(localStorage.getItem("tunnelOption"));
    attrOption["mileage"] = this.huanhao;
    this._facilityInspService.getFacilityInspDetailsListByAttrs(attrOption).then((result)=> {
      this.diseaseList = result.docs;
    }, (error) => {

    });
  }

  private _convertDate(date) {
    return new Date(date).toISOString().slice(0,10);
  }
}