import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

@Injectable()
export class DBService {
  private _db = new PouchDB('birthday2', { adapter: 'websql' });

  constructor(private http: Http, private events: Events) {
    this._db.put({_id: new Date(), title: 'heros'});
  }

  getHeros(): Promise<Array<any>> {
    return this._db.allDocs({ include_docs: true });
  }
}