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
  HAS_LOGGED_IN = 'hasLoggedIn';
  storage = new Storage(LocalStorage);
  
  constructor(public http: Http, public events: Events) { }
  
  /**
   * user login
   * @param  {Credentials} credentials
   */
  public login(credentials: Credentials) {
    let _that = this;
    let options = {
      headers: new Headers({ 'Authorization': makeBaseAuth(credentials) })
    };

    return new Promise((resolve, reject) =>{
      _that.events.publish('user:login');
      var request = _that.http.post(
        AppConfig.apiBase + '/login',
        {},
        options
      );

      request.subscribe((response)=>{
        _that.storage.set(_that.HAS_LOGGED_IN, true);
        if(response.status < 400){
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

    function makeBaseAuth(credentials: Credentials) {
			var tok = credentials.userName + ':' + credentials.password;
			var hash = btoa(tok);
			return "Basic " + hash;
		}
  }

  /**
   * user logout */
  public logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('user_token');
    this.storage.remove('username');
    this.events.publish('user:logout');
  }

  /**
   * set username */
  private setUsername(username: string) {
    this.storage.set('username', username);
  }

  
  /**
   * @returns Promise<string>
   */
  public getUsername(): Promise<string> {
    return this.storage.get('username')
  }

  private setUserToken(token: string) {
    this.storage.set('user_token', token);
  }

  /**
   * @returns Promise<string>
   */
  public getUserToken(): Promise<string> {
    return this.storage.get('user_token');
  }
  
  /**
   * @returns Promise<boolean>
   */
  public hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }
}
