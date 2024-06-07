/** enum.js
 * 枚举工具类的定义
 * 可以全局使用inject("globalConstEnum").getDescByValue()等方法
 */
//  import { v4 as uuidv4 } from "uuid";
 const EnumUtil = {};
  
 /**
  * @description
  * @param {*} App
  * @param {*} data
  */
 EnumUtil.install = function (App, data) {
     const constantInfo = data || {};
     const Enum = { ...data };
     /**
      * @description 根据枚举值获取描述
      * @param {*} constantName  枚举对象的名字
      * @param {*} value         枚举值
      * @param {*} label          枚举值所对应的描述
      */
     Enum.getDescByValue = function (constantName, value) {
         if (!this.hasOwnProperty(constantName)) {
             return '';
         }
         let constantItem = constantInfo[constantName]; // 通过传进来的名字拿到所对应的常量项
         for (let item in constantItem) {
             // 循环常量项
             if (constantItem[item].value === value) {
                 return constantItem[item].label
             }
         }
     };
     /**
      * @description 将枚举对象转为数组
      * @param {*} constantName  枚举对象的名字
      * @param {[]} fliterValues  过滤数值
      */
     Enum.transformArray = function (constantName, fliterValues = []) {
         if (!this.hasOwnProperty(constantName)) {
             return [];
         }
         let tempArr = [];
         if (Object.prototype.toString.call(constantInfo[constantName]) === '[object Object]') {
             tempArr = Object.values(constantInfo[constantName]).map((item,index) => {
                 return {
                     ...item,
                    //  id: uuidv4()
                     id: index+1
                 }
             }).filter(item => fliterValues.includes(item.value));
         }
         return tempArr;
     }
     /**
      * @description 判断常量是否存在枚举对象
      * @param {*} constantName  枚举对象的名字
      */
     Enum.hasOwnProperty = function (constantName) {
         return constantInfo.hasOwnProperty(constantName);
     }
     //  挂在原型上，方便使用--vue3推荐用法
     App.provide('globalConstEnum', Enum);
 }
  
 export default EnumUtil;