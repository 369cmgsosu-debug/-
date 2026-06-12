const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let list = [];

// タスク追加
app.post("/add", (req, res) => {
  const { date, reporter, location, status, comment, assignee, dueDate } = req.body;

  if (!assignee) {
    return res.status(400).send({ ok: false, error: "Assignee is required" });
  }

  const task = {
    date,
    reporter,
    location,
    status: status || "Not Started",
    comment,
    assignee,
    dueDate,
    createdAt: new Date()
  };

  list.push(task);
  res.send({ ok: true });
});

// 一覧取得
app.get("/list", (req, res) => {
  res.json(list);
});


// タスク削除
app.post("/delete", (req, res) => {
  const { index } = req.body;
  if (list[index]) {
    list.splice(index, 1);
    res.send({ ok: true });
  } else {
    res.status(404).send({ ok: false, error: "Not found" });
  }
});

// タスク更新
app.post("/update", (req, res) => {
  const { index, task } = req.body;
  if (list[index]) {
    list[index] = { ...list[index], ...task };
    res.send({ ok: true });
  } else {
    res.status(404).send({ ok: false, error: "Not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("start"));
