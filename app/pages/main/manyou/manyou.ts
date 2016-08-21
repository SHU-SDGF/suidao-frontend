/// <reference path="../../../../typings/index.d.ts" />

import {Component, OnInit, DynamicComponentLoader, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {MenuController, Events, Backdrop} from 'ionic-angular';
import {MenuTip} from '../../../shared/components/menu_tip';

interface Autodest{
  
};

@Component({
  selector: 'mainyou-page',
  templateUrl: './build/pages/main/manyou/manyou.html'
})
export class ManyouPage implements AfterViewInit {

  ngAfterViewInit() {
    
  }

}