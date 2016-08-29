import { Injectable } from '@angular/core';


const SPLITE_SIM = '\r\n';
const KeyMapper = [
  ['里程', 'mileage']
];

@Injectable()
export class QRCodeService{


  construct() { }
  
  parse(data: string) {
    let ar = data.split(SPLITE_SIM);
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