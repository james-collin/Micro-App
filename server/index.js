const express = require("express");
const path = require("path");
const createPdfAndSend = require("./utilities/createPdfAndSend");

const app = express();
app.use(express.json());

app.post("/order", (req, res) => {
  createPdfAndSend(req.body.order)
    .then(() => console.log("email was sent succesfull"))
    .catch(err => console.log(err));
  res.json("ok");
});

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.resolve(__dirname, "..", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`LISTENING ON ${port}`);
});
