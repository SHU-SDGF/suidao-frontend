import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import { FacilityInspDetail } from '../../models/FacilityInspDetail'

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const DB_NAME = 'DB_NAME';

@Injectable()
export class FacilityInspDetailDB {
	private _db;
	private _facilityInspDetails;

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('facilityInspDetails', { adapter: 'websql' });
  }

  addNewFacilityInspDetail(FacilityInspDetailObject: FacilityInspDetail) {
  	return this._db.post(FacilityInspDetailObject);
  }

  updateFacilityInspDetail(FacilityInspDetailObject: FacilityInspDetail) {
  	return this._db.put(FacilityInspDetailObject);
  }

  getAllFacilityInspDetails() {
  	if(!this._facilityInspDetails) {
	  	return this._db.allDocs({include_docs: true})
				.then(docs => {
					this._facilityInspDetails = docs.rows.map(row => {
						return row.doc
					});

					return this._facilityInspDetails;
				})
  	} else {
  		return Promise.resolve(this._facilityInspDetails);
  	}
  }
}