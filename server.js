const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h1>パトロール</h1>
    <p>サイト完成！</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
