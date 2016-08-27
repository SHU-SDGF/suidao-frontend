import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import {AppConfig} from './config';

export interface Credentials{
  userName: string, 
  password: string
}


@Injectable()
export class UserService {
  _favorites = [];
  storageKeys = {
    HAS_LOGGED_IN : 'has_logged_in',
    USER_INFO : 'user_info',
    USER_NAME : 'user_name',
    USER_TOKEN : 'user_token',
    AUTH_TOKEN : 'auth_token'
  };
  LOGIN_EVENT: string = 'user:login';
  LOGOUT_EVENT: string = 'user:logout';
  

  storage = new Storage(LocalStorage);
  
  constructor(public http: Http, public events: Events) { }
  
  /**
   * user login
   * @param  {Credentials} credentials
   */
  public login(credentials: Credentials) {
    let _that = this;

    return new Promise((resolve, reject) =>{
      var request = _that.http.post(
        AppConfig.apiBase + '/login',
        credentials
      );

      request.subscribe((response)=>{
        _that.storage.set(_that.storageKeys.HAS_LOGGED_IN, true);
        if(response.status < 400){
          var result = response.json();
          generateAuthToken(result);
          _that._setUsername(credentials.userName);
          _that._setUserInfo(result);
          _that._setUserToken(result.accessToken);
          _that.events.publish(this.LOGIN_EVENT);
          
          resolve();
        }else{
          reject();
        }
      }, (error)=>{
        reject();
      });
    });

    function generateAuthToken(result) {
      var tok = result.loginId + ':' + result["token"];
      var hash = btoa(tok);
      let authToken = "Basic " + hash;
      _that.storage.set("authToken", authToken);
    }
  }

  /**
   * user logout */
  public logout() {
    for (let key in this.storageKeys) {
      this.storage.remove(this.storageKeys[key]);
    }
    this.events.publish(this.LOGOUT_EVENT);
  }

  /**
   * set username */
  private _setUsername(username: string) {
    this.storage.set(this.storageKeys.USER_NAME, username);
  }

  /**
   * set user info */
  private _setUserInfo(userInfo) {
    this.storage.set(this.storageKeys.USER_INFO, JSON.stringify(userInfo));
  }

  /**
   * get user info
   */
  public getUserInfo(): Promise<UserInfo> {
    return this.storage.get(this.storageKeys.USER_INFO).then((userInfo) => {
      return JSON.parse(userInfo);
    });
  }
  
  /**
   * @returns Promise<string>
   */
  public getUsername(): Promise<string> {
    return this.storage.get(this.storageKeys.USER_NAME)
  }

  private _setUserToken(token: string) {
    this.storage.set(this.storageKeys.USER_TOKEN, token);
  }

  /**
   * @returns Promise<string>
   */
  public getUserToken(): Promise<string> {
    return this.storage.get(this.storageKeys.USER_TOKEN);
  }
  
  /**
   * @returns Promise<boolean>
   */
  public hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.storageKeys.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }
}

export interface UserInfo{
  userName: string,
  isAdmin: boolean,
  gender: number,
  telNo: string,
  mobile: string,
  address: string
}