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

	addNewEnvironmentActivitySummary(environmentActivitySummary) {
		return this._db.post(environmentActivitySummary);
	}

	updateEnvironmentActivitySummary(environmentActivitySummary) {
		return this._db.put(environmentActivitySummary);
	}

	getEnvironmentActivitySummariesByActName(act_name) {
		this._db.createIndex({
			index: { fields: ["act_name"]}
		}).then(function() {
			return this._db.find({
				selector: {act_name: act_name}
			});
		})
	}
}