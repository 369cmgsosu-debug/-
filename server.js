const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // ←これ追加

let list = [];

// 画面表示
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// データ追加
app.post("/add", (req, res) => {
  list.push(req.body.text);
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
