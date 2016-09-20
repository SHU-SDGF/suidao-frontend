import {Component, OnInit, ViewChild, EventEmitter, ElementRef} from '@angular/core';
import {NavController, ViewController, ToastController, Toast, AlertController, ModalController, NavParams} from 'ionic-angular';
import {ImageEditor, MapOptions, MarkerOptions, Latlng} from '../../../../../../shared/components/image-editor/image-editor';
import {MenuTip, ActionMenuControl} from '../../../../../../shared/components/menu-tip/menu-tip';
import {ObservSavePage} from '../observ_save/observ_save';
import {LookupService} from '../../../../../../providers/lookup_service';
import {DiseaseInfoPage} from '../disease_info/disease_info';


@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_graph/observ_graph.html',
  directives: [ImageEditor, MenuTip]
})
export class ObservGraphPage implements OnInit{
  @ViewChild(MenuTip) _menuTip: MenuTip;
  @ViewChild(ImageEditor) _imageEditor: ImageEditor;
  @ViewChild('actionButton') actionButton: ElementRef;

  private _mileage: string;
  private _onEdit = false;
  private _selectedDiseaseType = null;
  private _toast: Toast = null;
  private changeOptions = new EventEmitter();
  private _mapOptions: MapOptions;
  private _unsavedMarker: MarkerOptions;
  private isnewRecord = true;
  private diseaseInfo: {
    date: string,
    count: number
  };

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
      "icon": 'build/imgs/jiefeng.png',
      "name": "腐蚀"
    }
  ];

  private actionMenuItems: Array<ActionMenuControl> = this.diseaseTypes.map((item, index) => {
    return {
      icon:  item["icon"],
      diseaseType: '',
      action: function() {
        this.enableDisease(this.actionMenuItems[index]);
      }.bind(this),
    };
  })
  
  private diseaseDetailRecords: any;
  private diseaseTypeList: any;
  private createDiseaseInfo: any;

  constructor(
    private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _lookupService: LookupService,
    private _params: NavParams
  ){ }

  ngOnInit(){
    //获取list
    this.diseaseDetailRecords = this._params.get("existingDiseaseList");
    this._mileage = this._params.get('mileage');
    this._lookupService.getDiseaseTypes().then((result) => {
      this.diseaseTypeList = result;
      for(let index in this.diseaseTypeList) {
        this.actionMenuItems[index]["diseaseType"] = this.diseaseTypeList[index];
      }
    });
    
    this._mapOptions = {
      imageUrl: 'build/imgs/underground.png',
      markers:[]
    };

    this._lookupService.getDiseaseInfo().then((result) =>{
      this.createDiseaseInfo = result;
    })

    setTimeout(()=>{
      this.changeOptions.emit(this._mapOptions);

      //添加坐标
      setTimeout(() => {
        for(let index in this.diseaseDetailRecords) {
          this._imageEditor.addMarker({
            diseaseNo: this.diseaseDetailRecords[index]["diseaseNo"],
            longitude: this.diseaseDetailRecords[index]["longitude"],
            latitude: this.diseaseDetailRecords[index]["latitude"],
            icon: this.getIconByDiseaseType(this.diseaseDetailRecords[index]["diseaseTypeId"])
          })
        }
      }, 200);
    });
  }

  menuBtnClick(event: Event){
    if(this._onEdit){
      this.toggleEdit();
      return;
    }
    this._menuTip.toggle();
    event.stopPropagation();
  }

  private toggleEdit(){
    this._onEdit = !this._onEdit;
    if (!this._onEdit) {
      // this fixes a bug of IONIC 2
      this.actionButton['_elementRef'].nativeElement.classList.remove('active');
      // done
      this.hideToast();
    } else {
      // this fixes a bug of IONIC 2
      this.actionButton['_elementRef'].nativeElement.classList.add('active');
      // done
      this.showToast();
    }
  }

  private mapTap($event){
    if(!this._onEdit) return;
    let _self = this;
    this._unsavedMarker = this._imageEditor.addMarker({
      longitude: $event.latlng.lng,
      latitude: $event.latlng.lat,
      icon: this._selectedDiseaseType.icon
    });

    this.hideToast().then(() => {
      let alert = this._alertCtrl.create({
        title: '添加环境活动',
        message: '你确认要在此处添加环境活动吗?',
        cssClass: 'alert-bottom',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              _self.removeUnsavedMarker();
              _self.showToast();
            }
          },
          {
            text: '确认',
            handler: () => {
              alert.dismiss().then((result) => {
                this.showCreateModal(this._unsavedMarker);
                _self.removeUnsavedMarker();
              })
            }
          }
        ]
      });
      alert.present();
    });
  }

  private markerClick(markerOptions: MarkerOptions) {
    let detail = this.diseaseDetailRecords.find((detail) => {
      return detail.diseaseNo == markerOptions.diseaseNo;
    });
    this._modalCtrl.create(DiseaseInfoPage, {disease: detail, mileage: this._mileage}).present();
  }

  showCreateModal(marker: MarkerOptions){
    let diesaseNo = '';
    if(marker.diseaseNo && marker.diseaseNo != '') {
      diesaseNo = marker.diseaseNo;
    } else {
      diesaseNo = this.generateDiseaseNo();
    }

    let modal = this._modalCtrl.create(ObservSavePage, {
      point: marker, 
      diseaseType: this._selectedDiseaseType, 
      diseaseNo: diesaseNo, 
      isNewRecord: this.isnewRecord, 
      diseaseInfo: this.diseaseInfo, 
      mileage: this._mileage
    });
    
    modal.present();
    let that = this;
    modal.onDidDismiss((value) => {
      this.toggleEdit();

      this._lookupService.getDiseaseInfo().then((result) => {
        this.createDiseaseInfo = result;
      })

      if(value){
        marker.diseaseNo = value.diseaseNo;
        marker.longitude = value.longitude;
        marker.latitude = value.latitude;
        this._imageEditor.addMarker(marker);
      }
    });
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }
  
  enableDisease(disease){
    this._menuTip.hide();
    
    this.toggleEdit();
    this._selectedDiseaseType = disease;
  }

  removeUnsavedMarker(){
    this._imageEditor.removeMarker(this._unsavedMarker);
  }

  showToast(){
    this._toast = this._toastCtrl.create({
      message: '长按图片添加病害。',
      position: 'top',
      dismissOnPageChange: true
    });
    this._toast.present();
  }

  hideToast(){
    if(!this._toast) return;
    this._toast.onDidDismiss(()=>{
      this._toast = null;
    });
    return this._toast.dismiss();
  }

  private fetchDiseaseNo() {
    this.diseaseInfo = {
      date: this.createDiseaseInfo["date"],
      count: this.createDiseaseInfo["count"]
    }
    return this.diseaseInfo.date + this.diseaseInfo.count;
  }

  private getIconByDiseaseType(diseaseType) {
    var diseaseTypeIndex = diseaseType[1] - 1;
    return this.diseaseTypes[diseaseTypeIndex]["icon"];
  }

  private generateDiseaseNo() {
    let today = new Date().toISOString().slice(0, 10).split('-').join('');
    
    if(this.createDiseaseInfo){
      if(this.createDiseaseInfo["date"] == today) {
        this.diseaseInfo = {
          date: this.createDiseaseInfo["date"],
          count: this.createDiseaseInfo["count"] + 1
        }
      } else {
        this.diseaseInfo = {
          date: today,
          count: 1
        }
      }
    } else {
       this.diseaseInfo = {
         date: today,
         count: 1
       }
    }

    return this.diseaseInfo.date + ("00" + this.diseaseInfo.count).slice(-3);
  }
}