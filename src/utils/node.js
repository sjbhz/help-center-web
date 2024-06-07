// nodejs将md文件转化为html,以及将html文件转化为md

const { marked } = require("marked");
const express = require("express");
const fs = require("fs");
//html转md
var { Sitdown } = require("sitdown");
var sitdown = new Sitdown();

const app = express();


app.get("/md", (req, res) => {
  //读取文件
  const readMe = fs.readFileSync("./static/md/my.md", "utf-8");
  //转化为html
  const markdownReadMe = marked(readMe);
  res.send(markdownReadMe);
});

app.get("/save", (req, res) => {
  const html = req.query.html;//此处使用get传输数据，post使用body-parser接收参数涉及对象转换问题，目前没有解决
  var md = sitdown.HTMLToMD(html);
  try {
    fs.writeFileSync("./static/md/my.md", md, "utf-8");
    res.send({ states: "ok", data: html });
  } catch (err) {
    res.send(err);
  }
});


app.listen(4000, () => {
  console.log("4000服务器开启了");
});