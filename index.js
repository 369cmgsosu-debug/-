const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello World");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT);
