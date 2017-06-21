import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { FacilityInspDetail } from '../../../models/FacilityInspDetail';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
window["PouchDB"] = PouchDB;  

@Injectable()
export class FacilityInspDetailDB {
	private _db;
	private _facilityInspDetails: FacilityInspDetail[];

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('facilityInspDetails', { adapter: 'websql', location: 'default' });
  };

  addNewFacilityInspDetail(FacilityInspDetailObject: FacilityInspDetail) {
  	return this._db.post(FacilityInspDetailObject.serialize());
  };

  updateFacilityInspDetail(FacilityInspDetailObject: FacilityInspDetail) {
    return this._db.put(FacilityInspDetailObject);
  };

  //批量生成巡检明细活动
  batchCreateFacilityInspDetails(FacilityInspDetailsObject: any) {
    return this._db.bulkDocs(FacilityInspDetailsObject);
  };

  //批量删除巡检明细活动
  batchDeleteFacilityInspDetails() {
    this._initDB();
    return this._db.allDocs().then((result) => {
      return Promise.all(result.rows.map((row) => {
        return this._db.remove(row.id, row.value.rev);
      }, (error) => {
      }));
    });
  }

  //根据病害号获取历史活动巡检
  getFacilityInspDetailByDiseaseNo(diseaseNo: any) {
    let that = this;
     this._db = new PouchDB('facilityInspDetails', { adapter: 'websql', location: 'default'});
     return new Promise((resolve, reject) =>{
       this._db.createIndex({
         index: {fields: ['diseaseNo']}
       }).then(function() {
         that._db.find({
           selector: {
             diseaseNo: diseaseNo
           }
         }).then((result) => {
           resolve(result);
         }, (error) => {
           reject(error);
         });
       });
     });
  }

  //获取巡检活动明细列表
  getAllFacilityInspDetails(): Promise<FacilityInspDetail[]> {
    this._db = new PouchDB('facilityInspDetails', { adapter: 'websql', location: 'default' });
  	return this._db.allDocs({include_docs: true})
			.then(docs => {
        this._facilityInspDetails = docs.rows.map(row => {
          return FacilityInspDetail.deserialize(row.doc);
        });
        return this._facilityInspDetails;
      })
  }
}