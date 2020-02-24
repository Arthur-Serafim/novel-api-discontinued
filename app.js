const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const listNovelsRouter = require("./routes/listNovels");
const listChapterRouter = require("./routes/listChapters");
const updateFeaturedRouter = require("./routes/updateFeatured");
const getChapterContentRouter = require("./routes/getChapterContent");
const listFeaturedRouter = require("./routes/listFeatured");
const filterRouter = require("./routes/filter");
const getNovelRouter = require("./routes/getNovel");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/list", listNovelsRouter);
app.use("/list/chapters", listChapterRouter);
app.use("/update/featured", updateFeaturedRouter);
app.use("/chapter/content", getChapterContentRouter);
app.use("/list/featured", listFeaturedRouter);
app.use("/filter", filterRouter);
app.use("/get/novel", getNovelRouter);

module.exports = app;
