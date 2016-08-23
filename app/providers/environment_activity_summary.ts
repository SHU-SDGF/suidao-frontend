import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';

let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

@Injectable()
export class EnvironmentActivitySummary {
	private _db;
	constructor() {

	}

	initDB() {
		this._db = new PouchDB('environment_activity_summary', { adapter: 'websql'})
	}


	//新增环境活动汇总表
	create(environmentActivitySummary) {
		return this._db.post(environmentActivitySummary);
	}

	//更新环境活动汇总表
	update(environmentActivitySummary) {
		return this._db.put(environmentActivitySummary);
	}

	getEnvironmentActivitySummariesByActName(act_name) {
		debugger;
		var that = this;
		this._db.find({
				selector: {"act_name": act_name}
			}).then(function(result) {
				debugger;
				return result;
			}, function(error){
				return error;
			});
		this._db.createIndex({
			index: { fields: ["act_name"]}
		}).then(function(result) {
			debugger;
			this._db.find({
				selector: {"act_name": act_name}
			}).then(function(result) {
				debugger;
				return result;
			}, function(error){
				return error;
			});
		}, function(error) {
			return 'error';
		});
	}
}