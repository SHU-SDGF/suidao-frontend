
export abstract class _baseClass{
  createUser: string //作成者
	updateUser: string // 更新者
	createDate: any //作成日时
  updateDate: any //更新日时

  constructor() {
    this.createDate = null;
    this.createUser = null;
    this.updateDate = null;
    this.updateUser = null;
  }

  public serialize: ()=>any;

  public assign(obj){
    if(!obj) return;
    for(let key in this){
      if(obj.hasOwnProperty(key))
        this[key] = obj[key];
    }
  }
}