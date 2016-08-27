import {Component, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {Events,
  ViewController
} from 'ionic-angular';
import {TunnelOption} from '../../underground';

@Component({
  templateUrl: './build/pages/main/xunjian/underground/components/tunnel-picker/tunnel-picker.html',
})
export class TunnelPicker implements OnInit{
  public tunnelOnchange = new EventEmitter();
  ngOnInit() {
    
  }
}