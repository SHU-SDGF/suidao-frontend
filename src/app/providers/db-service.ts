import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

import * as PouchDB from 'pouchdb';
import * as pouchdbFind from 'pouchdb-find';

PouchDB.plugin(pouchdbFind);

@Injectable()
export class DBService {
  private _db = new PouchDB('birthday2', { adapter: 'websql' });

  constructor(private http: Http, private events: Events) {
    this._db.put({_id: new Date(), title: 'heros'} as any);
  }

  getHeros(): Promise<any> {
    return this._db.allDocs({ include_docs: true } as any);
  }
}