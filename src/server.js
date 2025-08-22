const app = require("./app");
const { connectDB } = require("./config/database");

connectDB()
  .then(() => {
    console.log("database is connected successfully");
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
