import { ObservInfoComponent } from './components/observ_info/observ-info.component';
import { LookupService } from '../../../../providers/lookup-service';
import { FacilityInspService } from '../../../../providers/facility-insp-service';
import { QRCodeService } from '../../../../providers/qrcode-service';
import {
  Component, OnInit, OnDestroy,
} from '@angular/core';
import { Events, AlertController, ModalController, NavController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import * as  _ from 'lodash';
import * as $ from 'jquery';
declare const cordova;
declare const QRScanner;

interface ImageSize{
  width: number,
  height: number
}

@Component({
  selector: 'underground',
  templateUrl: './underground.component.html',
  styles: ['./underground.component.scss']
})
export class UndergroundComponent implements OnInit, OnDestroy {
  private facilityInspList: any = [];
  private shadowFacilityInspList: any = [];
  private scale: number;
  private imgHeight: number;
  private diseaseTypes = this._lookupService.getDiseaseTypesInfo();

  constructor(
    private _events: Events,
    private _alertCtrl: AlertController, 
    private _modalCtrl: ModalController,
    private _codeService: QRCodeService,
    private _facilityInspService: FacilityInspService,
    private _navCtrl: NavController,
    private _lookupService: LookupService,
    private _sanitizer: DomSanitizer
  ){}

  ngOnInit(){
    //search
    this._events.subscribe('groundDataChange', ()=>{
      this.reloadData();
    });
    
  }

  ngAfterViewInit() {
    this.getImgScale().then((scale)=>{
      this.scale = scale;
      this.reloadData();
    });
    
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
    if(facilityInspInfo.facilityInsp) {
      localStorage.setItem('scannedInfo', JSON.stringify({"mileage": facilityInspInfo["mileage"], "facilityId": facilityInspInfo.facilityInsp[0]["facilityId"]}));
    }
    this._navCtrl.push(ObservInfoComponent, {'facilityInspInfo': facilityInspInfo});
  }

  scanCode() {
    
    // QRScanner.scan(function(err, status){
    //   err && console.error(err);
    //   console.log(status);
    //   document.getElementsByTagName('html')[0].style.opacity = '1';
    //   QRScanner.hide();
    //   QRScanner.destroy();
    // });
    
    // QRScanner.show(function(status){
    //   console.log(status);
    //   document.getElementsByTagName('html')[0].style.opacity = '0';
    // });
    if (window['cordova']) {
      debugger;
      cordova.plugins.barcodeScanner.scan((result) => {
        try{
          result.text && this.showInfo(result.text);
        }catch(e){
          this._alertCtrl.create({
            title: '扫码失败',
            message: '扫描错误，或二维码信息有误，请重试！'
          });
          console.log(e);
        }
        
      }, (error) => {
        console.log(error);
      });
    }else{
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
      this.showInfo(info);
      
    }
    
  }

  private showInfo(info){
    let scannedIndex = -1;
    let result = this._codeService.parse(info);
    console.log(result);

    scannedIndex = (<Array<any>>this.facilityInspList).findIndex((insp=>insp.mileage == result["mileage"]));
    let facilityInspInfo = {};

    if(scannedIndex == -1) {
      facilityInspInfo = {
        mileage: result["mileage"],
        facilityId: result["NO"],
        facilityInsp: null
      }
    } else {
      facilityInspInfo = this.facilityInspList[scannedIndex];
    }
    
    this.showObservInfo(facilityInspInfo);
    
    localStorage.setItem('scannedInfo', JSON.stringify({"mileage": result["mileage"], "facilityId": result["NO"]}));
  }

  private getImgScale(){
    return new Promise<number>((resolve, reject)=>{
      var image = new Image();
      image.src = 'assets/imgs/underground.png';
      image.onload = () => {
        let size: ImageSize = getImageSize(image);
        let imgWidth = ($(window).width() - 56);
        let scale = size.width / imgWidth;
        this.imgHeight = size.height / scale;
        /*
        let actualSize: ImageSize ={
          width: $(window).width() - 56,
          height: scale * size.height
        };
        */

        resolve(scale);
      };

      function getImageSize(image) {
        return{
          width: image.width,
          height: image.height
        };
      }
    });
  }

  private async reloadData() {
    let tunnelOption = JSON.parse(localStorage.getItem('tunnelOption'));
    this.facilityInspList = [];
    let details = await this._facilityInspService.getFacilityInspDetailsByAttrs(tunnelOption);
    details.forEach((detail) => {
      Object.assign(detail, {
        iconLeft: detail.longitude / this.scale,
        iconTop: this.imgHeight - detail.latitude / this.scale - 15,
        icon: this.getIconByDiseaseType(detail.diseaseTypeId)
      });
    });
    var filteredResult = _.groupBy(details, 'mileage');
    for (let index in filteredResult) {
      this.facilityInspList.push({ mileage: index, facilityInsp: filteredResult[index] })
    }

    this.shadowFacilityInspList = _.cloneDeep(this.facilityInspList);
    console.log(this.facilityInspList);
    console.log(this.scale);
  }

  private getIconByDiseaseType(diseaseType) {
    var diseaseTypeIndex = diseaseType[1] - 1;
    return this.diseaseTypes[diseaseTypeIndex]["icon"];
  }
}

export interface TunnelOption{
  direction: { id: number, name: string },
  struct: {id: number, name: string}
}