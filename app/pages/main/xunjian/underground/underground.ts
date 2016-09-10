import {Component, OnInit, OnDestroy,
  DynamicComponentLoader, ViewChild,
  AfterViewInit, ElementRef, EventEmitter} from '@angular/core';
import {MenuController, Events, ToastController, AlertController, ModalController, NavController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {ObservInfoPage} from './components/observ_info/observ_info';
import {QRCodeService} from '../../../../providers/qrcode_service';
import {FacilityInspService} from '../../../../providers/facility_insp_service';
import * as  _ from 'lodash';
declare const cordova;

@Component({
  selector: 'underground-page',
  templateUrl: './build/pages/main/xunjian/underground/underground.html',
})
export class UndergroundPage implements OnInit, OnDestroy {
  private facilityInspList: any = [];
  private shadowFacilityInspList: any = [];

  constructor(
    private _events: Events,
    private _alertCtrl: AlertController, 
    private _modalCtrl: ModalController,
    private _codeService: QRCodeService,
    private _facilityInspService: FacilityInspService
  ){}

  ngOnInit(){
    //search
    
  }

  ngAfterViewInit() {
    this.reloadData();
    this._events.subscribe('optionChange', this.reloadData.bind(this));

    this._events.subscribe('searchInspAct', ((searchArg) => {
      console.log(searchArg);
      this.facilityInspList = _.cloneDeep(this.shadowFacilityInspList);
      this.facilityInspList = _.filter(this.facilityInspList, ((result) => {
        return result["mileage"].includes(searchArg)
      }));
    }))
  }

  ngOnDestroy(){

  }

  showObservInfo(facilityInspInfo){
    let modal = this._modalCtrl.create(ObservInfoPage, {'facilityInspInfo': facilityInspInfo});
    modal.present();
    modal.onDidDismiss((value) => {
      // this.reloadData();
    });
  }

  scanCode(){
    let info = `
      里程：EK11+702\r\n
      编码：HMNL104SZCQHK117000_A00\r\n
      埋深：-11.62m\r\n
      管片类型：出洞环\r\n
      封顶块位置：3\r\n
      管片姿态-高程：-2mm\r\n
      管片姿态-平面：7mm\r\n
      管片横径：13298mm\r\n
      管片竖径：13335mm\r\n
      横竖鸭蛋：37mm\r\n
      管片入场状态：T,T,F,F,F,F,F,F,F\r\n
      管片拼装后状态：T\r\n
      生产厂商：隧道股份股份上海隧道工程\r\n
      拼装日期：2013.12
    `;
    let scannedIndex = "";
    let result = this._codeService.parse(info);
    console.log(info);

    for(let index in this.facilityInspList) {
      if(this.facilityInspList[index]["mileage"] == result["mileage"]) {
        scannedIndex = index;
      }
    }
    let facilityInspInfo = {};

    if(scannedIndex == "") {
      facilityInspInfo = {
        mileage: result["mileage"],
        facilityInsp: null
      }
    } else {
      facilityInspInfo = this.facilityInspList[scannedIndex];
    }
    let modal = this._modalCtrl.create(ObservInfoPage, {'facilityInspInfo': facilityInspInfo});
    modal.present();
    modal.onDidDismiss((value) => {
      this.reloadData();
    });
    localStorage.setItem('scannedInfo', JSON.stringify({"mileage": result["mileage"], "mfacility": result["NO"]}));

    /*
    cordova.plugins.barcodeScanner.scan((result) => {
        let alert = this._alertCtrl.create({
            title: "Scan Results",
            subTitle: result.text,
            buttons: ["Close"]
        });
        alert.present();
    }, (error) => {
      let alert = this._alertCtrl.create({
          title: "Scan Results",
          subTitle: error,
          buttons: ["Close"]
      });
      alert.present();
    });
    */
  }

  private filterFacilityInsp(searchArg) {
  };

  private reloadData() {
    let that = this;
    let tunnelOption = JSON.parse(localStorage.getItem('tunnelOption'));
    this.facilityInspList = [];
    this._facilityInspService.getFacilityInspDetailsByAttrs(tunnelOption).then((result) => {
      var filteredResult =  _.groupBy(result.docs, 'mileage');
      for(var index in filteredResult) {
        that.facilityInspList.push({mileage: index, facilityInsp: filteredResult[index]})
      }

      that.shadowFacilityInspList = _.cloneDeep(that.facilityInspList);
    }, (error) => {

    });
  }
}

export interface TunnelOption{
  direction: { id: number, name: string },
  struct: {id: number, name: string}
}