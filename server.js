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

// 担当者設定
app.post("/assign", (req, res) => {
  const { index, assignee } = req.body;
  if (list[index]) {
    list[index].assignee = assignee;
    res.send({ ok: true });
  } else {
    res.status(404).send({ ok: false, error: "Not found" });
  }
});

// 対応済み設定
app.post("/done", (req, res) => {
  const { index } = req.body;
  if (list[index]) {
    list[index].done = true;
    res.send({ ok: true });
  } else {
    res.status(404).send({ ok: false, error: "Not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("start"));
