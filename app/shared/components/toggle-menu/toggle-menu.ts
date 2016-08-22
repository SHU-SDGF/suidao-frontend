import {MenuController, Events, Backdrop} from 'ionic-angular';

export class toggleMenu{
  constructor(private menuCtrl: MenuController) {
    
  }

  toggleMenu() {
    this.menuCtrl.toggle();
    if (!this.menuCtrl.getMenus()[0].isOpen) {
      $('.menu-content-push').addClass('menu-content-open');
    } else {
      $('.menu-content-push').removeClass('menu-content-open');
    }
  }
}