import { Http, Headers } from '@angular/http';
import { AppConfig } from './config';
import {URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
	constructor(public http: Http) {}

	public post(paramsObj: any, url: string) {
		let _that = this;

		var headers = new Headers();
		headers.append('Authorization', localStorage.getItem("authToken"));

    let request = _that.http.post(
      AppConfig.apiBase + '/' + url,
      paramsObj,{
        headers: headers
      }
    );
    
    return request.map((response)=>{
      return response.json();
    });
	}

  public get(paramsObj: any, url: string) {
    let _that = this;
    var headers = new Headers();
    headers.append('Authorization',localStorage.getItem("authToken"));
    let queryObj = {
      headers: headers
    }

    if(Object.keys(paramsObj).length !== 0) {
      let searchParams: URLSearchParams = new URLSearchParams();
      for (let param in paramsObj) {
        searchParams.set(param, paramsObj[param]);
      }
      queryObj["search"] = searchParams;
    }

    let request = _that.http.get(
      AppConfig.apiBase + '/' + url, queryObj
    );
    return request.map((response)=>{
      return response.json();
    });
  }
}