import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {NavController, ViewController, 
  AlertController, ModalController} from 'ionic-angular';
import {ObservSavePage} from '../observ_save/observ_save';
import {AppUtils} from '../../../../../../shared/utils';
import {SelectPopover} from  '../../../../../../shared/components/select-popover/select-popover';
import {ObservGraphPage} from '../observ_graph/observ_graph';
import {FacilityInspSummary} from  '../../../../../../models/FacilityInspSummary';
import {DiseaseInfoPage} from '../disease_info/disease_info';

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
      "icon": 'build/imgs/cuotai.png',
      "name": "错台"
    },
    {
      "icon": 'build/imgs/jiefeng.png',
      "name": "接缝"
    },
    {
      "icon": 'build/imgs/liefeng.png',
      "name": "裂缝"
    },
    {
      "icon": 'build/imgs/luoshuang.png',
      "name": "螺栓"
    },
    {
      "icon": 'build/imgs/shenlou.png',
      "name": "渗漏"
    },
    {
      "icon": 'build/imgs/sunhuai.png',
      "name": "损坏"
    },
    {
      "icon": 'build/imgs/xichu.png',
      "name": "析出"
    }
  ];

  private selectedPage = 'disease';

  private huanhao = this.huanhaoList[1];

  private diseaseList: FacilityInspSummary[] = [];

  constructor(
    private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _modalCtrl: ModalController){

  }

  ngOnInit(){
    
    let a = {
      id: 0,
      diseaseNo: 0,
      delFlg: '',
      diseaseDate: 0,
      facilityType: 0,
      mfacilityList: '',
      mileage: '',
      modelNameList: '',
      monomerNoList: '',
      photoStandard: '',
      posDespList: '',
      tagId: '',
      updateCnt: ''
    };

    for(let i = 0; i < 5; i++){
      a.id = ~~(Math.random() * 10000);
      a.diseaseNo = i % 7;
      a.diseaseDate = (new Date).getTime();

      let disease = FacilityInspSummary.deserialize(a);
      this.diseaseList.push(disease);
    }    
  }

  viewDisease(disease){
    let modal = this._modalCtrl.create(DiseaseInfoPage,{disease: disease});
    modal.present();
  }

  viewGraph(){
    let modal = this._modalCtrl.create(ObservGraphPage);
    modal.present();
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
}