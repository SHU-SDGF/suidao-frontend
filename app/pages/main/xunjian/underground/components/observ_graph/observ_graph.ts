import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {NavController, ViewController, ToastController, Toast, AlertController, ModalController} from 'ionic-angular';
import {ImageEditor, MapOptions, MarkerOptions, Latlng} from '../../../../../../shared/components/image-editor/image-editor';
import {MenuTip, ActionMenuControl} from '../../../../../../shared/components/menu-tip/menu-tip';
import {ObservSavePage} from '../observ_save/observ_save';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_graph/observ_graph.html',
  directives: [ImageEditor, MenuTip]
})
export class ObservGraphPage implements OnInit{
  @ViewChild(MenuTip) _menuTip: MenuTip;
  @ViewChild(ImageEditor) _imageEditor: ImageEditor;

  private _onEdit = false;
  private _selectedDiseaseType = null;
  private _toast: Toast = null;
  private changeOptions = new EventEmitter();
  private _mapOptions: MapOptions;
  private _unsavedMarker: MarkerOptions;

  private actionMenuItems: Array<ActionMenuControl> = [
    {
      icon: 'build/imgs/cuotai.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[0]);
      }.bind(this),
    },
    {
      icon: 'build/imgs/jiefeng.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[1]);
      }.bind(this),
    },
    {
      icon: 'build/imgs/liefeng.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[2]);
      }.bind(this),
    },
    {
      icon: 'build/imgs/luoshuang.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[3]);
      }.bind(this),
    },
    {
      icon: 'build/imgs/shenlou.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[4]);
      }.bind(this),
    },
    {
      icon: 'build/imgs/sunhuai.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[5]);
      }.bind(this),
    },
    {
      icon: 'build/imgs/xichu.png',
      action: function() {
        this.enableDisease(this.actionMenuItems[6]);
      }.bind(this),
    }
  ];

  constructor(private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ){ }

  ngOnInit(){
    this._mapOptions = {
      imageUrl: 'build/imgs/underground.png',
      markers:[]
    };
    setTimeout(()=>{
      this.changeOptions.emit(this._mapOptions);
    })
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
    if(!this._onEdit){
      this.hideToast();
    }else{
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
              alert.dismiss().then(() => {
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

  showCreateModal(marker: MarkerOptions){
    let modal = this._modalCtrl.create(ObservSavePage, {point: marker});
    modal.present();

    modal.onDidDismiss((value)=>{
      if(value){
        this._imageEditor.addMarker(marker);
      }else{
        this.showToast();
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

}