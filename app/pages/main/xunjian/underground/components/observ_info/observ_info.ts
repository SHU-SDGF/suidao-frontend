import {Component, OnInit, ViewChild } from '@angular/core';
import {NavController, ViewController, ToastController, Toast} from 'ionic-angular';
import {ImageEditor} from '../../../../../../shared/components/image-editor/image-editor';
import {MenuTip, ActionMenuControl} from '../../../../../../shared/components/menu-tip/menu-tip';


@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_info/observ_info.html',
  directives: [ImageEditor, MenuTip]
})
export class ObservInfoPage{
  @ViewChild(MenuTip) _menuTip: MenuTip;

  private _onEdit = false;
  private _selectedDiseaseType = null;
  private _toast: Toast = null;

  private actionMenuItems: Array<ActionMenuControl> = [
    {
      icon: 'build/imgs/underground.png',
      action: function() {
        this.enableDisease({});
      }.bind(this),
    },
    {
      icon: 'build/imgs/underground.png',
      action: function() {console.log(1)}.bind(this),
    },
    {
      icon: 'build/imgs/underground.png',
      action: function() {console.log(2)}.bind(this),
    },
    {
      icon: 'build/imgs/underground.png',
      action: function() {console.log(2)}.bind(this),
    }
  ];

  constructor(private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _toastCtrl: ToastController
  ){ }

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
      if(this._toast) this._toast.dismiss();
    }
  }

  private mapTap(){
  }

  dismiss(){
    this._viewCtrl.dismiss();
  }

  enableDisease(disease){
    this._menuTip.hide();
    this._toast = this._toastCtrl.create({
      message: '长按图片添加病害。',
      position: 'top',
      dismissOnPageChange: true
    });
    this._toast.present();
    this.toggleEdit();
    this._selectedDiseaseType = disease;
  }

}