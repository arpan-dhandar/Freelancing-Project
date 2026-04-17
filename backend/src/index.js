import config from "./config/config.js"
import  app  from "./app.js"
import connectDB from "./db/db.js";

connectDB()
.then(()=>{
    app.listen(config.PORT || 8000, () => {
        console.log(`0 Server is running at port : ${config.PORT}`);
        
    })
})

.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
    
})

