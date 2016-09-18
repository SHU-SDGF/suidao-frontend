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
  private _facilityInspSummary: Array<FacilityInspSummary>;

  constructor(private http: Http, private events: Events) {
  }

  _initDB() {
  	this._db = new PouchDB('facitlityInspSummaries', { adapter: 'websql', location: 'default' });
    console.log("*****************");
    console.log(this._db.adapter);
  }

  getFacilityInspsByAttrs(monomerId, modelId): any{
    let that = this;
     this._db = new PouchDB('facitlityInspSummaries', { adapter: 'websql', location: 'default' });
     return new Promise((resolve, reject) =>{
       this._db.createIndex({
         index: {fields: ['monomer']}
       }).then(function() {
         that._db.find({
           selector: {
             monomerId: monomerId,
             modelId: modelId
           }
         }).then((result) => {
           resolve(result);
         }, (error) => {
           reject(error);
         });
       });
     });
  }

  getFacilityInspDetailsListByAttrs(monomerId, modelId, mileage): any{
    let that = this;
    this._db = new PouchDB('facitlityInspSummaries', {adapter: 'websql', location: 'default'});
    return new Promise((resolve, reject) => {
      this._db.createIndex({
        index: {fields: ['monomer, modelName, mileage']}
      }).then(() => {
        this._db.find({
          selector: {
            monomerId: monomerId,
            modelId: modelId,
            mileage: mileage
          }
        }).then((result) => {
          resolve(result);
        }, (error) => {
          reject(error);
        });
      });
    });
  }

  //根据巡检活动编号找到巡检活动
  getFacilityInspByDiseaseNo(diseaseNo: any) {
    return this._db.find({
      selector: {diseaseNo: diseaseNo}
    })
  }

  updateFacilityInsp(facilityObj: any) {
    return this._db.put(facilityObj);
  }

  //生成一条巡检活动
  addNewFacilityInspSummary(FacilityInspSummaryObject: any) {
  	return this._db.post(FacilityInspSummaryObject.serialize());
  }

  //批量生成巡检活动
  batchCreateFacilityInspSummaries(FacilityInspSummariesObject: any) {
    return this._db.bulkDocs(FacilityInspSummariesObject);
  }

  //批量删除巡检活动
  batchDeleteFacilityInspSummarise() {
    this._initDB();
    return this._db.allDocs().then((result) => {
      return Promise.all(result.rows.map((row) => {
        return this._db.remove(row.id, row.value.rev);
      }));
    });
  }

  getAllFacilityInspSummaries(): Promise<Array<FacilityInspSummary>> {
    this._db = new PouchDB('facitlityInspSummaries', { adapter: 'websql', location: 'default' });
    this._facilityInspSummary = [];
  	return this._db.allDocs({include_docs: true})
			.then(docs => {
				return this._facilityInspSummary = (<Array<any>>docs.rows).filter((row)=>{
          return !row.doc.language;
        }).map((row, index) => {
					return FacilityInspSummary.deserialize(row.doc);
				});
			});
  }
}