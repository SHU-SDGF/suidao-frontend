import {Component, OnInit } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {ImageEditor} from '../../../../../../shared/components/image-editor/image-editor';
import {MenuTip, ActionMenuControl} from '../../../../../../shared/components/menu-tip/menu-tip';


@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/observ_info/observ_info.html',
  directives: [ImageEditor, MenuTip]
})
export class ObservInfoPage{

  private actionMenuItems: Array<ActionMenuControl> = [
    {
      icon: 'build/imgs/underground.png',
      action: ()=>{console.log(0)},
    },
    {
      icon: 'build/imgs/underground.png',
      action: ()=>{console.log(1)},
    },
    {
      icon: 'build/imgs/underground.png',
      action: ()=>{console.log(2)},
    }
  ];

  constructor(private _navCtrl: NavController,
    private _viewCtrl: ViewController
  ){ }

  dismiss(){
    this._viewCtrl.dismiss();
  }



}