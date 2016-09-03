import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import { FacilityInspSummary } from '../../models/FacilityInspSummary';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
window["PouchDB"] = PouchDB; 

@Injectable()
export class FacilityInspSummaryDB {
  private _db;
  private _facilityInspSummary;

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('facitlityInspSummaries', { adapter: 'websql' });
  }

  //生成一条巡检活动
  addNewFacilityInspSummary(FacilityInspSummaryObject: any) {
  	return this._db.post(FacilityInspSummaryObject.serialize());
  }

  //批量生成巡检活动
  batchCreateFacilityInspSummaries(FacilityInspSummariesObject: any) {
    return this._db.buckDocs(FacilityInspSummariesObject);
  }

  //批量删除巡检活动
  batchDeleteFacilityInspSummarise() {
    this._db.allDocs().then(function(result) {
      // Promise isn't supported by all browsers; you may want to use bluebird
      return Promise.all(result.rows.map(function (row) {
        return this._db.remove(row.id, row.value.rev);
      }));
    }).then(function () {
      // done!
    }).catch(function (err) {
      // error!
    });
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