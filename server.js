const app = require("./src/app");
const connectdb = require("./src/db/db");
require("dotenv").config();
connectdb();
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
