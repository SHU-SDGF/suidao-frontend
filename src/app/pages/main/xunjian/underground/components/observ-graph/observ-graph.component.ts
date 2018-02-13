import { DiseaseInfoComponent } from '../disease-info/disease-info.component';
import { ObservSaveComponent } from '../observ-save/observ-save.component';
import { UserService } from '../../../../../../providers/user-service';
import { LookupService } from '../../../../../../providers/lookup-service';
import { MapOptions } from 'angular2-baidu-map/dist/angular2-baidu-map';
import {Component, OnInit, ViewChild, EventEmitter, ElementRef} from '@angular/core';
import {NavController, ViewController, ToastController, Toast, AlertController, ModalController, NavParams} from 'ionic-angular';
import { MenuTip, ActionMenuControl } from '../../../../../../shared/components/menu-tip/menu-tip.directive';
import { ImageEditor } from '../../../../../../shared/components/image-editor/image-editor.directive';
import { MarkerOptions } from '../../../../../../shared/components/suidao-map/suidao-map.component';

@Component({
  templateUrl: './observ-graph.component.html',
  styles: ['./observ-graph.component.scss'],
  selector: 'observ-graph'
})
export class ObservGraphComponent implements OnInit{
  @ViewChild(MenuTip) _menuTip: MenuTip;
  @ViewChild(ImageEditor) _imageEditor: ImageEditor;
  @ViewChild('actionButton') actionButton: ElementRef;

  private _mileage: string;
  private _onEdit = false;
  private _selectedDiseaseType = null;
  private _toast: Toast = null;
  private changeOptions = new EventEmitter();
  private _mapOptions: any;
  private _unsavedMarker: MarkerOptions;
  private isnewRecord = true;
  private diseaseInfo: {
    date: string,
    count: number
  };

  private diseaseTypes = this._lookupService.getDiseaseTypesInfo();

  private actionMenuItems: Array<ActionMenuControl> = this.diseaseTypes.map((item, index) => {
    return {
      icon: item["icon"],
      diseaseType: '',
      action: function() {
        this.enableDisease(this.actionMenuItems[index]);
      }.bind(this),
    };
  })
  
  private diseaseDetailRecords: any;
  private diseaseTypeList: any;
  private createDiseaseInfo: any;
  private loginId: any;

  constructor(
    private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _lookupService: LookupService,
    private _userService: UserService,
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

    this._userService.getUserInfo().then((userInfo) => {
      this.loginId = userInfo.loginId;
    });
    
    this._mapOptions = {
      imageUrl: 'assets/imgs/jiemian.jpg',
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

  public toggleEdit(){
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

  public mapTap($event){
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
              this.showCreateModal(this._unsavedMarker);
              _self.removeUnsavedMarker();
            }
          }
        ]
      });
      alert.present();
    });
  }

  public markerClick(markerOptions: MarkerOptions) {
    let detail = this.diseaseDetailRecords.find((detail) => {
      return detail.diseaseNo == markerOptions.diseaseNo;
    });
    this._modalCtrl.create(DiseaseInfoComponent, {disease: detail, mileage: this._mileage}).present();
  }

  showCreateModal(marker: MarkerOptions){
    let diseaseNo = '';
    if(marker.diseaseNo && marker.diseaseNo != '') {
      diseaseNo = marker.diseaseNo;
    } else {
      diseaseNo = this.generateDiseaseNo();
    }

    let modal = this._modalCtrl.create(ObservSaveComponent, {
      point: marker, 
      diseaseType: this._selectedDiseaseType, 
      diseaseNo: diseaseNo, 
      isNewRecord: this.isnewRecord, 
      diseaseInfo: this.diseaseInfo, 
      mileage: this._mileage
    });
    
    modal.present();
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

  public fetchDiseaseNo() {
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
    let dateObj = this.getLocalTime();
    let today = dateObj.today;
    let formatToday =  dateObj.formatToday;
    
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

    return formatToday + ("00" + this.diseaseInfo.count).slice(-3);
  }

  private getLocalTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return {
      formatToday: year + [month, day, date.getHours(), date.getMinutes()].map((t) => {
        return ('00' + t).slice(-2);
      }).join('') ,
      today: year + '' + month + '' + day
    }
  }
}