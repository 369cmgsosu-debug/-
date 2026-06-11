app.get("/", (req, res) => {

  let html = `
    <h1>パトロール管理</h1>

    <h2>記録登録</h2>
    <form method="POST" action="/add">
      <input type="date" name="date"><br>
      <input name="person" placeholder="記入者"><br>
      <input name="place" placeholder="場所"><br>

      <select name="status">
        <option value="○">○</option>
        <option value="△">△</option>
        <option value="×">×</option>
      </select><br>

      <input name="comment" placeholder="コメント"><br>
      <button>登録</button>
    </form>

    <h2>一覧</h2>
  `;

  list.forEach(item => {
    html += `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <p>日付: ${item.date}</p>
        <p>記入者: ${item.person}</p>
        <p>場所: ${item.place}</p>
        <p>状態: ${item.status}</p>
        <p>コメント: ${item.comment}</p>
      </div>
    `;
  });

  res.send(html);
});
