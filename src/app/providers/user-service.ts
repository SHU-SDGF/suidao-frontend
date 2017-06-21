import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import {AppConfig} from './config';
import {User} from '../../models/User';
import {HttpService} from './http-service';

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
  

  constructor(
    public http: Http, 
    public events: Events, 
    public httpService: HttpService) { }
  
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
        localStorage.setItem(_that.storageKeys.HAS_LOGGED_IN, 'true');
        if(response.status < 400){
          var result = response.json();
          generateAuthToken(result);
          _that._setUsername(credentials.userName);
          _that._setUserInfo(result);
          _that._setUserToken(result.token);
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
      localStorage.setItem("authToken", authToken);
    }
  }

  /**
   * user logout */
  public logout() {
    for (let key in this.storageKeys) {
      localStorage.removeItem(this.storageKeys[key]);
    }
    this.events.publish(this.LOGOUT_EVENT);
  }

  /**
   * set username */
  private _setUsername(username: string) {
    localStorage.setItem(this.storageKeys.USER_NAME, username);
  }

  /**
   * set user info */
  private _setUserInfo(userInfo) {
    localStorage.setItem(this.storageKeys.USER_INFO, JSON.stringify(userInfo));
  }

  /**
   * get user info
   */
  public getUserInfo(): Promise<User> {
    let userInfo = localStorage.getItem(this.storageKeys.USER_INFO);
    return Promise.resolve(User.deserialize(JSON.parse(userInfo)));
  }
  
  /**
   * @returns Promise<string>
   */
  public getUsername(): Promise<string> {
    return Promise.resolve(localStorage.getItem(this.storageKeys.USER_NAME));
  }

  private _setUserToken(token: string) {
    localStorage.setItem(this.storageKeys.USER_TOKEN, token);
  }

  /**
   * @returns Promise<string>
   */
  public getUserToken(): Promise<string> {
    return Promise.resolve(localStorage.getItem(this.storageKeys.USER_TOKEN));
  }
  
  /**
   * @returns Promise<boolean>
   */
  public hasLoggedIn(): Promise<boolean> {
    let state = localStorage.getItem(this.storageKeys.HAS_LOGGED_IN);
    if (!state || state === 'false') {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }

  public getUserByID(id: string){
    return this.httpService
      .get({loginId: id}, '/user/searchByLoginId').map((response)=>{
        return User.deserialize(response);
      });
  }
}