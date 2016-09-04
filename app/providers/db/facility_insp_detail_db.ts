import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';
import { Http } from '@angular/http';
import { FacilityInspDetail } from '../../models/FacilityInspDetail';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
window["PouchDB"] = PouchDB;  

@Injectable()
export class FacilityInspDetailDB {
	private _db;
	private _facilityInspDetails;

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('facilityInspDetails', { adapter: 'websql' });
  };

  addNewFacilityInspDetail(FacilityInspDetailObject: FacilityInspDetail) {
  	return this._db.post(FacilityInspDetailObject.serialize());
  };

  //批量生成巡检明细活动
  batchCreateFacilityInspDetails(FacilityInspDetailsObject: any) {
    return this._db.buckDocs(FacilityInspDetailsObject);
  };

  //批量删除巡检明细活动
  batchDeleteFacilityInspDetails() {
    this._db.allDocs().then(function (result) {
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

  updateFacilityInspDetail(FacilityInspDetailObject: FacilityInspDetail) {
  	return this._db.put(FacilityInspDetailObject.serialize());
  }

  //获取巡检活动明细列表
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