import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';

let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

@Injectable()
export class EnvironmentActivity {
	private _db;
	constructor() {
	}

	initDB() {
		this._db = new PouchDB('environment_activity', { adapter: 'websql'});
	}

	//添加活动历史记录
	addNewEnvironmentActivity(environmentActivity) {
		return this._db.post(environmentActivity);
	}

	//显示活动历史记录(过滤条件是ACT_NO)
	findEnvironmentActivityListByActNo(act_no) {
		this._db.createIndex({
			index: { fields: ["act_no"] }
		}).then(function() {
			return this._db.find({
				selector: {act_no: act_no}
			});
		})
	}
}