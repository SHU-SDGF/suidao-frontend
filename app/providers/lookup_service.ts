import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

/*
  Generated class for the LookupService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LookupService {

  constructor(private http: Http) {}

  private localStorage;
  // 单体枚举表
  private _db_monomers;
  // 
	private _db_facilitiy_types;
	// 位置描述枚举表
	private _db_position_descriptions;
	// 活动类型枚举表
	private _db_act_types;

	private monomers = [
		{
			id: 1,
		 	text: "东线隧道",
		 	order: "1"
		},
		{
			id: 2,
		 	text: "西线隧道",
		 	order: "2"
		},
		{
			id: 3,
		 	text: "浦东工作井",
		 	order: "3"
		},
		{
			id: 4,
			text: "浦西工作井",
			order: "4"
		},
		{
			id: 5,
			text: "1#联络通道",
			order: "5"
		},
		{
			id: 6,
			text: "2#联络通道",
			order: "6"
		},
		{
			id: 7,
			text: "隧道管理大楼",
			order: "7"
		},
		{
			id: 8,
			text: "矩形段安全通道",
			order: "8"
		},
		{
			id: 9,
			text: "矩形段电缆通道",
			order: "9"
		},
		{
			id: 10,
			text: "保护区",
			order: "A"
		},
		{
			id: 11,
			text: "浦东龙门架",
			order: "B"
		},
		{
			id: 12,
			text: "浦西龙门架",
			order: "C"
		}
	];
	initDB() {
		let monomers_data = [
			{
				_id: "1",
			 	text: "东线隧道",
			 	order: "1"
			},
			{
				_id: "2",
			 	text: "西线隧道",
			 	order: "2"
			},
			{
				_id: "3",
			 	text: "浦东工作井",
			 	order: "3"
			},
			{
				_id: "4",
				text: "浦西工作井",
				order: "4"
			},
			{
				_id: "5",
				text: "1#联络通道",
				order: "5"
			},
			{
				_id: "6",
				text: "2#联络通道",
				order: "6"
			},
			{
				_id: "7",
				text: "隧道管理大楼",
				order: "7"
			},
			{
				_id: "8",
				text: "矩形段安全通道",
				order: "8"
			},
			{
				_id: "9",
				text: "矩形段电缆通道",
				order: "9"
			},
			{
				_id: "10",
				text: "保护区",
				order: "A"
			},
			{
				_id: "11",
				text: "浦东龙门架",
				order: "B"
			},
			{
				_id: "12",
				text: "浦西龙门架",
				order: "C"
			}
		];

		let act_types_data = [
			{ id: 1, name: "加载", order: 1},
			{ id: 2, name: "减载", order: 2},
			{ id: 3, name: "振动", order: 3},
			{ id: 4, name: "静载", order: 4},
			{ id: 5, name: "其他", order: 5}
		];

		let act_status_data = [
			{ id: 1, name: "未开始", order: 0},
			{ id: 2, name: "进行中", order: 1},
			{ id: 3, name: "已结束", order: 2}
		];

		let authority_data = [
			{ id: 1, name: "技术人员", order: 3},
			{ id: 2, name: "中控巡检管理", order: 6},
			{ id: 3, name: "中控巡检采集", order: 7}
		]

		this.localStorage = new Storage(LocalStorage);
		this.localStorage.set('monomers', JSON.stringify(monomers_data));
		this.localStorage.set('act_types', JSON.stringify(act_types_data));
		this.localStorage.set('act_status_data', JSON.stringify(act_status_data));
		this.localStorage.set('authority_data', JSON.stringify(authority_data));

		// this._db_monomers = new PouchDB('monomers', { adapter: 'websql'});
		// this._db_facilitiy_types = new PouchDB('facility_types', { adapter: 'websql'});
		// this._db_position_descriptions = new PouchDB('position_descriptions', { adapter: 'websql' });
		// this._db_act_types = new PouchDB('act_types', { adapter: 'websql'});
	}

	// loadData() {
	// 	// 单体表
	// 	this._db_monomers.allDocs({
	// 		include_docs: true
	// 	}).then(function(result) {
	// 		if(result.row.length == 0) {
	// 			//load data
	// 			let monomers_data = [
	// 				{
	// 					_id: "1",
	// 				 	text: "东线隧道",
	// 				 	order: "1"
	// 				},
	// 				{
	// 					_id: "2",
	// 				 	text: "西线隧道",
	// 				 	order: "2"
	// 				},
	// 				{
	// 					_id: "3",
	// 				 	text: "浦东工作井",
	// 				 	order: "3"
	// 				},
	// 				{
	// 					_id: "4",
	// 					text: "浦西工作井",
	// 					order: "4"
	// 				},
	// 				{
	// 					_id: "5",
	// 					text: "1#联络通道",
	// 					order: "5"
	// 				},
	// 				{
	// 					_id: "6",
	// 					text: "2#联络通道",
	// 					order: "6"
	// 				},
	// 				{
	// 					_id: "7",
	// 					text: "隧道管理大楼",
	// 					order: "7"
	// 				},
	// 				{
	// 					_id: "8",
	// 					text: "矩形段安全通道",
	// 					order: "8"
	// 				},
	// 				{
	// 					_id: "9",
	// 					text: "矩形段电缆通道",
	// 					order: "9"
	// 				},
	// 				{
	// 					_id: "10",
	// 					text: "保护区",
	// 					order: "A"
	// 				},
	// 				{
	// 					_id: "11",
	// 					text: "浦东龙门架",
	// 					order: "B"
	// 				},
	// 				{
	// 					_id: "12",
	// 					text: "浦西龙门架",
	// 					order: "C"
	// 				}
	// 			]
	// 			this._db_monomers.bulkDocs(monomers_data).then(function(result) {
	// 			}).catch(function (err) {
	// 			});
	// 		}
	// 	}).catch(function (err) {
	// 	})
	// 	// 活动类型枚举表
	// 	this._db_monomers.allDocs({
	// 		include_docs: true
	// 	}).then(function(result) {
	// 		if(result.row.length == 0) {
	// 			let act_types_data = [
	// 				{
	// 					"_id": "1",
	// 					"name": "加载"
	// 				},{

	// 				}
	// 			]
	// 		}
	// 	})
	// }
}
