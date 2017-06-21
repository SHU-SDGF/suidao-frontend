
import { Injectable } from '@angular/core';
import * as $ from 'jquery';

const KeyMapper = [
  ['里程', 'mileage'],
  ['编码', 'NO'],
  ['埋深', 'deepth'],
  ['管片类型', 'gplx'],
  ['封顶块位置', 'fdkwz'],
  ['管片姿态-高程', 'gpztgc'],
  ['管片姿态-平面', 'gpztpm'],
  ['管片横径', 'gphj'],
  ['管片竖径', 'gpsj'],
  ['横竖鸭蛋', 'hsyd'],
  ['管片入场状态', 'gprczt'],
  ['管片拼装后状态', 'gppzhzt'],
  ['生产厂商', 'sccs'],
  ['拼装日期', 'date']
];

@Injectable()
export class QRCodeService{

  construct() { }
  
  parse(data: string) {
    let ar = data.split('\r\n').map((t)=>{return $.trim(t);})
    let obj = {};

    ar.forEach(str => {
      if (!str) return;
      let key = str.split('：')[0];
      let value = str.split('：')[1];
      let mapper = KeyMapper.find((value) => {
        return value[0] === key;
      });
      if (!mapper) return;
      obj[mapper[1]] = value;
    });

    return obj;
  }

    

}