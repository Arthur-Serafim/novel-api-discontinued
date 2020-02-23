var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var listNovelsRouter = require("./routes/listNovels");
var listChapterRouter = require("./routes/listChapters");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/list", listNovelsRouter);
app.use("/list/chapters", listChapterRouter);

module.exports = app;
