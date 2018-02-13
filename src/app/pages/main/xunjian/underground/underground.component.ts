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
import { FacilityInfoORM } from '../../../../../orm/providers/facility-info-orm.service';
import { ActionSheet } from 'ionic-native';
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
    private _sanitizer: DomSanitizer,
    private _facilityInfoOrm: FacilityInfoORM,
  ){}

  ngOnInit(){
    //search
    this._events.subscribe('groundDataChange', ()=>{
      this.reloadData();
    });
    
  }

  async ngAfterViewInit() {
    this._events.subscribe('optionChange', this.reloadData.bind(this));

    this._events.subscribe('searchInspAct', ((searchArg) => {
      console.log(searchArg);
      this.facilityInspList = _.cloneDeep(this.shadowFacilityInspList);
      this.facilityInspList = _.filter(this.facilityInspList, ((result) => {
        return result["mileage"].includes(searchArg)
      }));
    }));

    this.scale = await this.getImgScale();
    this.reloadData();
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
        编码：HMNL104SZCQHK127880_I00\r\n
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

  private async showInfo(info) {
    try {
      let result = this._codeService.parse(info);

      console.log(result);
      let facilityInspInfo = {};
      let inspNo: string = result['NO'];
  
      console.log(await this._facilityInfoOrm.getInspect(inspNo));
      if (!inspNo) throw new Error('二维码错误');
      const r = new RegExp(/[0-9]*_/);
      let numPart = parseInt(r.exec(inspNo)[0].slice(0, -1));
      let optionIDs = [inspNo.replace(r, (numPart - 20) + '_'), inspNo, inspNo.replace(r, (numPart + 20) + '_')];
  
      let options = await this._facilityInfoOrm.getInspectByIDs(optionIDs);
  
      if (!options || !options.length) {
        this._alertCtrl.create({
          title: '错误',
          message: '未发现扫码的环号'
        });
        return;
      }
  
      ActionSheet.show({
        title: '选择环号',
        buttonLabels: options.map(o => o.facilityName),
        addCancelButtonWithLabel: '取消',
      }).then((buttonIndex: number) => {
        let selectedOption = options[buttonIndex - 1];
        let scannedIndex = -1;
          
        scannedIndex = (<Array<any>>this.facilityInspList).findIndex((insp => insp.mileage == selectedOption.facilityName));
  
        if (scannedIndex == -1) {
          facilityInspInfo = {
            mileage: selectedOption.facilityName,
            facilityId: inspNo,
            facilityInsp: null
          }
        } else {
          facilityInspInfo = this.facilityInspList[scannedIndex];
        }
        
        this.showObservInfo(facilityInspInfo);
        localStorage.setItem('scannedInfo', JSON.stringify({ mileage: selectedOption.facilityName, facilityId: selectedOption.id }));
      });
    } catch (e){
      this._alertCtrl.create({
        title: '发生错误',
        message: e.toString()
      });
    }
    
  }

  private getImgScale(){
    return new Promise<number>((resolve, reject)=>{
      var image = new Image();
      image.src = 'assets/imgs/jiemian.jpg';
      image.onload = () => {
        let size: ImageSize = getImageSize(image);
        let imgWidth = ($(window).width() - 56);
        let scale = size.width / imgWidth;
        this.imgHeight = size.height / scale;
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
    let filteredResult = _.groupBy(details, 'mileage');
    for (let index in filteredResult) {
      let t = { mileage: index, facilityInsp: filteredResult[index] };
      this.facilityInspList.push(t);
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