const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let list = [];

// 追加
app.post("/add", (req, res) => {
  list.push(req.body);
  res.send({ ok: true });
});

// 一覧取得
app.get("/list", (req, res) => {
  res.json(list);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("start"));
