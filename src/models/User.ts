
export class User { // 结构巡检明细表
	_id: string //pouchdb 主键id,其实就是diseaseNo
	loginId: string;
  userName: string;
  isAdmin: string;
  gender: string;
  telNo: string;
  mobile: string;
  address: string;

	constructor(obj = null) {
		this._id = null;
		this.loginId = null;
    this.userName = null;
    this.isAdmin = null;
    this.gender = null;
    this.telNo = null;
    this.mobile = null;
    this.address = null;
    if (obj) {
      Object.assign(this, obj);
    }
	}
}