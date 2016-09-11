import {JsonProperty, Serializable} from '../providers/JsonMapper';
import {_baseClass} from './_baseClass';

@Serializable()
export class User extends _baseClass { // 结构巡检明细表
	_id: string //pouchdb 主键id,其实就是diseaseNo
	loginId: string;
  userName: string;
  isAdmin: string;
  gender: string;
  telNo: string;
  mobile: string;
  address: string;

	constructor(obj = null) {
		super()
		this._id = null;
		this.loginId = null;
    this.userName = null;
    this.isAdmin = null;
    this.gender = null;
    this.telNo = null;
    this.mobile = null;
    this.address = null;

		this.assign(obj);
	}

	static deserialize: (obj)=> User;
}