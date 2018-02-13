import { TunnelORM } from './orm.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

const MAX_ROW_LENGTH = 1000; // length of chunk

@Injectable()
export class SqlHelper {

  constructor(
    private _orm: TunnelORM,
  ) { }

  /**
   * insert large scale of data, cut into pieces of chunk
   *
   * @param {string} tableName
   * @param {string[]} columns
   * @param {any[][]} rows
   *
   * @memberOf SqlHelper
   */
  public async insertMultiRows(tableName: string, columns: string[], rows: any[][]) {

    const rowCount = rows.length;
    let times = Math.ceil(rowCount / MAX_ROW_LENGTH);

    for (let count = 0; count < times; count++) {
      let _rows = rows.slice(count * MAX_ROW_LENGTH, (count + 1) * MAX_ROW_LENGTH);
      console.log(`inserting to ${tableName}, 
        rows: ${count * MAX_ROW_LENGTH + 1} to ${(count + 1) * MAX_ROW_LENGTH}`);
      await this._insertMultiRows(tableName, columns, _rows);
    }
  }

  /**
   * insert a chunk of data into database
   *
   * @private
   * @param {string} tableName
   * @param {string[]} columns
   * @param {any[][]} rows
   *
   * @memberOf SqlHelper
   */
  private async _insertMultiRows(tableName: string, columns: string[], rows: any[][]) {
    const rowCount = rows.length;
    let values = [];
    columns = columns.map((c) => '`' + c + '`');

    for (let i = 0; i < rowCount; i++) {
      let _values = rows[i]
        .map((key) => this.convertValue(key)).join(',');
      _values = `(${_values})`;
      values.push(_values);
    }
    const sql = `INSERT INTO ${tableName}(${columns.join(',')}) VALUES ${values.join(',')}`;
    let queryRunner = await this._orm.connection.driver.createQueryRunner();
    await queryRunner.query(sql, []);
  }

  /**
   * convert value into sql compatable input value
   *
   * @private
   * @param {*} value
   * @returns
   *
   * @memberOf SqlHelper
   */
  private convertValue(value: any) {
    return _.isNumber(value) ? value :
      (_.isString(value) ? `'${value}'` :
        (_.isUndefined(value) || _.isNull ? `''` : (
          _.isBoolean(value) ? (value ? 1 : 0) : `''`
        )));
  }

  /**
   * escape sql string
   *
   * @private
   * @param {any} str
   * @returns
   *
   * @memberOf SqlHelper
   */
  private escapeString(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (c) {
      switch (c) {
        case '\0':
          return '\\0';
        case '\x08':
          return '\\b';
        case '\x09':
          return '\\t';
        case '\x1a':
          return '\\z';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '"':
        case '\'':
        case '\\':
        case '%':
          return '\\' + c; // prepends a backslash to backslash, percent,
        // and double/single quotes
        default:
          return c;
      }
    });
  }
}
