/** 
 * 常量枚举池
 * 可以根据文件对枚举所属的模块进行拆分
 * 此文件主要是收集模块常量然后统一暴露出去
 */
const EnumModule = {};

// 批量导入当前文件所在目录下的.js文件--直接引入
const options = import.meta.glob('./*.js', { eager: true, import: 'default' });
console.log('options--',options)
Object.keys(options).forEach((fileName) => {
    // const name = fileName.replace(/\.\/|\.js/g, '');
    // EnumModule[name] = options[fileName].default;
    console.log('fileName--',fileName)
    Object.assign(EnumModule, {
        ...options[fileName]
    })
});
console.log('EnumModule--',EnumModule)
export default EnumModule;