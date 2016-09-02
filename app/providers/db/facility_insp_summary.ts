import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import { FacilityInspSummary } from '../../models/FacilityInspSummary';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const DB_NAME = 'DB_NAME';

@Injectable()
export class FacilityInspSummaryDB {
  private _db;
  private _facilityInspSummary;

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('facitlityInspSummaries', { adapter: 'websql' });
  }

  addNewFacilityInspSummary(FacilityInspSummaryObject: FacilityInspSummary) {
  	return this._db.post(FacilityInspSummaryObject.serialize());
  }

  updateFacilityInspSummary(FacilityInspSummaryObject: FacilityInspSummary) {
  	return this._db.put(FacilityInspSummaryObject.serialize());
  }

  getAllFacilityInspSummaries() {
  	if(!this._facilityInspSummary) {
	  	return this._db.allDocs({include_docs: true})
				.then(docs => {
					this._facilityInspSummary = docs.rows.map(row => {
						return row.doc
					});

					return this._facilityInspSummary;
				})
  	} else {
  		return Promise.resolve(this._facilityInspSummary);
  	}
  }
}