import {Pipe, Injectable} from '@angular/core';

@Pipe({
  name: 'DatePipe'
})
class DatePipe{
  transform(datetime, args?) {
    let date = new Date(datetime);
    return [
      date.getFullYear(),
      StringUtils.leftPad((date.getMonth() + 1), 2, '0'),
      StringUtils.leftPad((date.getDate() + 1), 2, '0')
    ].join('-');
  }
}

/**
 * 常用的字符串处理方法
 * @author accountwcx@qq.com
 * @date 2015-08-12
 */
let StringUtils = (function(){
    var
        // 字符串去掉两边空白正则表达式
        trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,

        // 字符串格式化正则表达式
        formatRegex = /\{(\d+)\}/g,

        htmlEncodeMap = {
            '"': "&quot;",
            '&': "&amp;",
            "'": "&#39;",
            '<': "&lt;",
            '>': "&gt;"
        },

        htmlDecodeMap = {
            '&#39;': "'",
            '&amp;': "&",
            '&gt;': ">",
            '&lt;': "<",
            '&quot;': '"'
        },

        htmlEncodeRegex = /(&|>|<|"|')/g,

        htmlDecodeRegex = /(&amp;|&gt;|&lt;|&quot;|&#39;|&#[0-9]{1,5};)/g;

    return {
        /**
         * 除去字符串两端的空白字符
         * @param   str  {String}  字符串
         * @return  返回处理后的字符串
         */
        trim: function(str){
            return str.replace(trimRegex, '');
        },

        /**
         * 允许用格式化的方式给传值
         * var cls = 'css-class', text = '内容';
         * var str = Rhui.String.format('<div class="{0}">{1}</div>', cls, text);
         * // str的内容是 <div class="css-class">内容</div>
         *
         * @param  str        {String}  待格式化的字符串
         * @param  params...  {Object}  与字符串中{0}、{1}...匹配的内容
         * @return 返回格式化后的字符串
         */
        format: function(str) {
            var i, args = arguments, len = args.length, arr = [];
            for(i = 1; i < len; i++){
                arr.push(args[i]);
            }

            return str.replace(formatRegex, function(m, i) {
                return arr[i];
            });
        },

        /**
         * 填补字符串左边
         * @param   str        {String}  原字符串
         * @param   size       {Number}  填补后的长度
         * @param   character  {String}  填补的字符，如果不填则为空字符' '
         * @return  返回填补后的字符串
         */
        leftPad: function(str, size, character) {
            var result = '' + str;

            if(Object.prototype.toString.call(character) !== '[object String]'){
                character = ' ';
            }

            while (result.length < size) {
                result = character + result;
            }

            return result;
        },

        /**
         * 填补字符串右边
         * @param   str        {String}  原字符串
         * @param   size       {Number}  填补后的长度
         * @param   character  {String}  填补的字符，如果不填则为空字符' '
         * @return  返回填补后的字符串
         */
        rightPad: function(str, size, character) {
            var result = '' + str;

            if(Object.prototype.toString.call(character) !== '[object String]'){
                character = ' ';
            }

            while (result.length < size) {
                result += character;
            }

            return result;
        },

        /**
         * 把字符串中的html字符转义
         * @param   str  {String}
         * @return  返回转义后的字符
         */
        htmlEncode: function(str) {
            if(Object.prototype.toString.call(str) === '[object String]'){
                return str.replace(htmlEncodeRegex, function(match, val){
                    return htmlEncodeMap[val];
                });
            }else{
                return str;
            }
        },

        /**
         * 把字符串中的html字符解码
         * @param   str  {String}
         * @return  返回解码后的字符串
         */
        htmlDecode: function(str) {
            if(Object.prototype.toString.call(str) === '[object String]'){
                return str.replace(htmlDecodeRegex, function(match, val){
                    return htmlDecodeMap[val];
                });
            }else{
                return str;
            }
        }
    };
})();

export class AppUtils {
  static DatePipe = DatePipe;
  static StringUtils = StringUtils;
}
