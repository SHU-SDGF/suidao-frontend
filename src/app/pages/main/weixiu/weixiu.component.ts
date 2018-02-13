import { Component } from '@angular/core';

@Component({
  selector: 'weixiu-component',
  templateUrl: './weixiu.component.html',
  styles: [
    `
    .col.icon-col {
      width: 30px;
      flex-grow: 0;
      line-height: 32px;
      font-size: 17px;
      color: #202737;
    }
    h4 {
      font-weight: bold;
    }
    .row {
      font-size: 12px;
    }
    .row {
      &::after{
        clear:both;
        content: " ";
        display: table;
        size: 0;
      }
      .col {
        width: 50%;
        float: left;
        .left {
          text-align: left;
        }
        .right {
          text-align: right;
        }
      }
    }
    `
  ]
})
export class WeixiuComponent {
  
}
