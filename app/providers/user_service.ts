import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import {AppConfig} from './config';

export interface Credentials{
  userName: string, 
  password: string
}

@Injectable()
export class UserService {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  storage = new Storage(LocalStorage);
  
  constructor(public http: Http, public events: Events) {}

  login(credentials: Credentials) {
    let _that = this;
    return new Promise((resolve, reject) =>{
      _that.storage.set(_that.HAS_LOGGED_IN, true);
      _that.events.publish('user:login');
      var request = _that.http.post(
        AppConfig.apiBase + '/login',
        credentials
      );

      request.subscribe((response)=>{
        if(response.status < 400){
          console.log(response);
          var result = response.json();
          _that.setUsername(credentials.userName);
          _that.setUserToken(result.accessToken);
          resolve();
        }else{
          reject();
        }
      }, (error)=>{
        reject();
      });

    });
  }

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('user_token');
    this.storage.remove('username');
    this.events.publish('user:logout');
  }

  setUsername(username: string) {
    this.storage.set('username', username);
  }

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  setUserToken(token) {
    this.storage.set('user_token', token);
  }

  getUserToken(token) {
    this.storage.get('user_token');
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }
}
