import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const DB_NAME = 'DB_NAME';

@Injectable()
export class FacilityInspDetail {
	private _db;

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('birthday2', { adapter: 'websql' });
  }

  
}