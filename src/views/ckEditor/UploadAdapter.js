// 配合ckeditor编辑器的上传类
export default class UploadAdapter {
  // 加载器
  #loader;
  // 上传的地址
  #uploadFileUrl = '';

  // 构造方法
  constructor(loader) {
    this.loader = loader
  }
  // 上传方法
  upload() {
    this.loader.file.then(res => {
      console.log('res')
    })
  }

  // 中止上传过程方法
  abort() { }
}