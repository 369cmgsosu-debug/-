let list = [];

app.post("/add", (req, res) => {
  const data = {
    date: req.body.date,
    person: req.body.person,
    place: req.body.place,
    status: req.body.status,
    comment: req.body.comment
  };

  list.push(data);

  res.redirect("/");
});
