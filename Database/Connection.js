import mongoose from "mongoose";

export const isdatabase_connected =async ()=>{
    await mongoose.connect(`mongodb+srv://JunaidKhan:${process.env.Database}@tododata.4opmabr.mongodb.net/`
    , {
  dbName: "TodoData",
}).then(c => {
  console.log("Connection Made")
}).catch(e => {
  console.log("Connection failed" + e)
})
}