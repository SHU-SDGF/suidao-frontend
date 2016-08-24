import { Http, Headers } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import { AppConfig } from './config';
import {URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
	constructor(public http: Http) {}

	public post(paramsObj: any, url: string) {
		let _that = this;

		var headers = new Headers();
		headers.append('Authorization',localStorage.getItem("authToken"));
		return new Promise((resolve, reject) =>{
      var request = _that.http.post(
        AppConfig.apiBase + '/' + url,
        paramsObj,{
        	headers: headers
        }
      );
      request.subscribe((response)=>{
        if(response.status < 400){
          var result = response.json();
          resolve();
        }else{
          reject();
        }
      }, (error)=>{
        reject();
      });
    });
	}
}