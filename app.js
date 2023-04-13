const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello TalkingLands from " + process.env.environment);
});
require("./geo/routes")(app)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
