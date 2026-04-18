import app from "./app.js";
import connectDB from "./db/db.js";
import config from "./config/config.js";

connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`🚀 SCARR backend running on http://localhost:${config.PORT}`);
  });
});
