const app = require("./app");

const mongoose = require("mongoose");

mongoose
  // eslint-disable-next-line no-undef
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to database 👍");
  })
  .catch(() => {
    console.log("Failed to connect to the database.");
    // eslint-disable-next-line no-undef
    process.exit(-1);
  });

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
});
